# Custom SSR

Мини-фреймворк для серверного рендеринга React-приложений, написанный с нуля на Express + Vite.
Реализует SSR в стиле Next.js: **файловую маршрутизацию** на основе папки `pages`, загрузку данных
через `getServerSideProps` и гидратацию на клиенте.

> Статическая генерация (`getStaticProps`) и ISR запланированы на следующих этапах — сейчас все страницы
> с данными рендерятся на каждый запрос (SSR).

## Возможности

- **File-based routing** — маршрут определяется путём файла в `src/pages` (см. «Маршрутизация»).
  Реестр страниц (`_pageManifest.ts`) **генерируется автоматически** при сборке, руками не пишется.
- **`getServerSideProps`** — загрузка данных на сервере в стиле Next.js с типобезопасным `GetServerSideProps<Props>`.
- **`_app.tsx`** — общая обёртка страниц (`Component` + `pageProps`), как в Next.js.
- **Гидратация** — серверная разметка «оживает» на клиенте, состояние React работает (`useState` и т.д.).
- **Vite-сборка клиента** с хешированными ассетами, манифестом и code-splitting по страницам.
- **Безопасная передача данных** сервер → клиент через `<script type="application/json">` с экранированием.

## Технологии

- **React 19** (`renderToString` + `hydrateRoot`)
- **Express 5** — HTTP-сервер и маршрутизация
- **Vite 7** — сборка клиентского бандла + плагин генерации манифеста
- **Tailwind CSS 4** — стили
- **TypeScript 5** (strict) + **tsx** для запуска сервера
- **axios** — HTTP-клиент для запросов данных

## Требования

- Node.js 20+
- pnpm

## Запуск

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Переменные окружения

Создайте файл `.env` в корне проекта:

```env
PORT=3000
```

### 3. Режим разработки

Запускается в двух терминалах (сначала клиент — его сборка генерирует `_pageManifest.ts`):

```bash
# Терминал 1 — сборка клиента с пересборкой при изменениях
pnpm dev:client

# Терминал 2 — сервер с автоперезапуском
pnpm dev:server
```

Приложение будет доступно на `http://localhost:3000`.

### 4. Продакшн-сборка

```bash
# Собрать клиентский бандл в public/ (заодно генерируется _pageManifest.ts)
pnpm build

# Запустить сервер
tsx --env-file=.env src/server/index.ts
```

## Маршрутизация

Маршрут страницы выводится из пути файла внутри `src/pages` (плоская схема в стиле Next.js pages-router):

| Файл                       | Маршрут       |
| -------------------------- | ------------- |
| `pages/index.tsx`          | `/`           |
| `pages/static.tsx`         | `/static`     |
| `pages/posts/[id].tsx`     | `/posts/:id`  |

Правила:

- `index` в конце пути отбрасывается (`foo/index.tsx` → `/foo`);
- `[param]` превращается в динамический сегмент Express `:param`;
- файлы и папки с префиксом `_` (`_app.tsx`, `_pageManifest.ts`) в роутинг не попадают.

При сборке Vite-плагин `plugins/vite-plugin-pages.ts` сканирует `src/pages` и генерирует
`src/pages/_pageManifest.ts` — реестр `маршрут → { Component, getServerSideProps, moduleId }`.
Этот файл **сгенерирован** (в `.gitignore`), редактировать его вручную не нужно.

## Структура проекта

```
plugins/
└── vite-plugin-pages.ts        # Плагин: сканирует pages и генерирует _pageManifest.ts

src/
├── app/
│   └── entry.client.tsx        # Клиентская точка входа: по moduleId динамически
│                               # импортирует страницу и гидратирует её
├── pages/                      # Страницы (file-based routing)
│   ├── _app.tsx                # Обёртка страниц: ({ Component, pageProps }) => ...
│   ├── _pageManifest.ts        # [СГЕНЕРИРОВАНО] реестр страниц
│   ├── index.tsx               # Страница "/"
│   ├── static.tsx              # Страница "/static" (без getServerSideProps)
│   └── posts/
│       └── [id].tsx            # Страница "/posts/:id"
│
├── server/
│   ├── index.ts                # Точка входа: поднимает HTTP-сервер
│   ├── app.ts                  # Express-приложение: static, /api, регистрация страниц из манифеста
│   ├── env.ts                  # Серверные переменные окружения (PORT)
│   ├── cache.ts                # In-memory кэш HTML (задел под будущие SSG/ISR)
│   ├── render/
│   │   ├── render-page.tsx     # renderToString + вставка данных и ассетов в HTML
│   │   └── assets.ts           # Чтение Vite-манифеста, извлечение js/css страницы
│   └── routes/
│       ├── create-page-handler.tsx  # SSR-хендлер: getServerSideProps → рендер
│       └── api/index.ts        # Заготовка под API-роуты
│
└── shared/                     # Код, общий для сервера и клиента
    ├── api/                    # HTTP-клиент (axios) и запросы
    ├── config/                 # Константы (ID скриптов, PUBLIC_PATH) и env
    ├── html-template/          # <Html> — обёртка документа (head/body/ссылки на ассеты)
    ├── styles/                 # Точка входа Tailwind
    └── types/                  # Общие типы (Post, GetServerSideProps)
```

## Как это работает

1. **Сборка.** Vite-плагин генерирует `_pageManifest.ts` из содержимого `src/pages`, затем Vite собирает
   `entry.client.tsx` в `public/` и пишет `manifest.json` с именами хешированных файлов.
2. **Старт сервера.** `app.ts` раздаёт статику из `public/`, подключает `/api` и регистрирует `app.get`
   для каждой записи `pageManifest`.
3. **Запрос страницы.** `create-page-handler` вызывает `getServerSideProps` (если есть), оборачивает страницу
   в `_app.tsx` и рендерит React в строку внутри `<Html>` с подключёнными js/css.
4. **Передача данных.** Начальные пропсы и `moduleId` страницы встраиваются в HTML как JSON-скрипты.
5. **Гидратация.** На клиенте `entry.client.tsx` читает `moduleId`, динамически импортирует нужную страницу
   и вызывает `hydrateRoot`, оборачивая её в тот же `_app.tsx`.

## Добавление новой страницы

1. Создайте файл в `src/pages`, например `src/pages/about.tsx` (→ `/about`) или `src/pages/users/[id].tsx`
   (→ `/users/:id`), с дефолтным экспортом компонента.
2. При необходимости экспортируйте `getServerSideProps`.
3. Готово — при следующей сборке страница автоматически попадёт в `_pageManifest.ts` и получит маршрут.

Пример:

```tsx
import { GetServerSideProps } from "@/shared/types";

type AboutPageProps = { title: string };

const AboutPage = ({ title }: AboutPageProps) => <h1>{title}</h1>;

export default AboutPage;

export const getServerSideProps: GetServerSideProps<AboutPageProps> = async (ctx) => {
  return { props: { title: "About" } };
};
```
