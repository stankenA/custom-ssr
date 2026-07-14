# Custom SSR

Мини-фреймворк для серверного рендеринга React-приложений, написанный с нуля на Express + Vite.
Реализует SSR и SSG в стиле Next.js: **файловую маршрутизацию** на основе папки `pages`, загрузку данных
через `getServerSideProps` / `getStaticProps` и гидратацию на клиенте.

> ISR (инвалидация статики по TTL / `revalidate`) запланирована на следующем этапе — сейчас статическая
> страница кэшируется до перезапуска сервера.

## Возможности

- **File-based routing** — маршрут определяется путём файла в `src/pages` (см. «Маршрутизация»).
  Реестр страниц (`_pageManifest.ts`) **генерируется автоматически** при сборке, руками не пишется.
- **`getServerSideProps`** — загрузка данных на сервере при каждом запросе, типобезопасно (`GetServerSideProps<Props>`).
- **`getStaticProps`** — данные вычисляются один раз, HTML кладётся в кэш и отдаётся из него (`GetStaticProps<Props>`).
- **Кэш статики** — страницы без `getServerSideProps` рендерятся при первом запросе и дальше отдаются из
  in-memory кэша по пути запроса (см. «Стратегии рендеринга»).
- **`_app.tsx`** — общая обёртка страниц (`Component` + `pageProps`), как в Next.js.
- **Гидратация** — серверная разметка «оживает» на клиенте, состояние React работает (`useState` и т.д.).
- **Vite-сборка клиента** с хешированными ассетами, манифестом и code-splitting по страницам.
- **Безопасная передача данных** сервер → клиент через `<script type="application/json">` с экранированием.

## Стратегии рендеринга

Стратегия выбирается по тому, что страница экспортирует — отдельного конфига нет:

| Экспорт страницы          | Поведение                                                                       |
| ------------------------- | ------------------------------------------------------------------------------- |
| `getServerSideProps`      | SSR: пропсы и HTML пересчитываются на каждый запрос, кэш не используется          |
| `getStaticProps`          | SSG: пропсы считаются при первом запросе, HTML кэшируется и отдаётся из кэша      |
| ничего                    | SSG без данных: HTML рендерится один раз и кэшируется                             |
| оба сразу                 | ошибка на этапе генерации манифеста                                               |

Кэш (`src/server/cache.ts`) — обычная `Map<путь, { html, timestamp }>` в памяти процесса: он наполняется
лениво, при первом запросе к маршруту, и живёт до перезапуска сервера. Для динамических маршрутов
(`/posts/:id`) ключом служит конкретный путь, так что каждый `id` кэшируется отдельно. Поле `timestamp`
пока не используется — это задел под ISR.

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
| `pages/static/index.tsx`   | `/static`     |
| `pages/posts/[id].tsx`     | `/posts/:id`  |

Правила:

- `index` в конце пути отбрасывается (`foo/index.tsx` → `/foo`);
- `[param]` превращается в динамический сегмент Express `:param`;
- файлы и папки с префиксом `_` (`_app.tsx`, `_pageManifest.ts`) в роутинг не попадают;
- статические маршруты регистрируются раньше динамических, чтобы `/posts/new` не перехватывался `/posts/:id`.

При сборке Vite-плагин `plugins/vite-plugin-pages.ts` сканирует `src/pages` и генерирует
`src/pages/_pageManifest.ts` — реестр `маршрут → { Component, getServerSideProps, getStaticProps, moduleId }`.
Если страница экспортирует и `getServerSideProps`, и `getStaticProps`, манифест бросит ошибку при загрузке.
Этот файл **сгенерирован** (в `.gitignore`), редактировать его вручную не нужно.

## Структура проекта

```
plugins/
└── vite-plugin-pages.ts        # Плагин: сканирует pages и генерирует _pageManifest.ts

src/
├── app/
│   └── entry.client.tsx        # Клиентская точка входа: по moduleId динамически
│                               # импортирует страницу (import.meta.glob) и гидратирует её
├── pages/                      # Страницы (file-based routing)
│   ├── _app.tsx                # Обёртка страниц: ({ Component, pageProps }) => ...
│   ├── _pageManifest.ts        # [СГЕНЕРИРОВАНО] реестр страниц
│   ├── index.tsx               # Страница "/" (getServerSideProps)
│   ├── static/
│   │   └── index.tsx           # Страница "/static" (getStaticProps)
│   └── posts/
│       └── [id].tsx            # Страница "/posts/:id"
│
├── server/
│   ├── index.ts                # Точка входа: поднимает HTTP-сервер
│   ├── app.ts                  # Express-приложение: static, /api, регистрация страниц из манифеста
│   ├── env.ts                  # Серверные переменные окружения (PORT)
│   ├── cache.ts                # In-memory кэш HTML для статических страниц
│   ├── render/
│   │   ├── render-page.tsx     # renderToString + вставка данных и ассетов в HTML
│   │   └── assets.ts           # Чтение Vite-манифеста, извлечение js/css страницы
│   └── routes/
│       ├── create-page-handler.ts   # Хендлер: кэш → getServerSideProps/getStaticProps → рендер
│       └── api/index.ts        # Заготовка под API-роуты
│
└── shared/                     # Код, общий для сервера и клиента
    ├── api/                    # HTTP-клиент (axios) и запросы
    ├── config/                 # Константы (ID скриптов, PUBLIC_PATH) и env
    ├── html-template/          # <Html> — обёртка документа (head/body/ссылки на ассеты)
    ├── styles/                 # Точка входа Tailwind
    └── types/                  # Общие типы (Post, GetServerSideProps, GetStaticProps)
```

## Как это работает

1. **Сборка.** Vite-плагин генерирует `_pageManifest.ts` из содержимого `src/pages`, затем Vite собирает
   `entry.client.tsx` в `public/` и пишет `manifest.json` с именами хешированных файлов.
2. **Старт сервера.** `app.ts` раздаёт статику из `public/`, подключает `/api` и регистрирует `app.get`
   для каждой записи `pageManifest`.
3. **Запрос страницы.** `create-page-handler` для статической страницы сначала проверяет кэш и при попадании
   сразу отдаёт готовый HTML. Иначе он вызывает `getServerSideProps` (с `req`/`res`) или `getStaticProps`
   (с `params`), оборачивает страницу в `_app.tsx` и рендерит React в строку внутри `<Html>` с подключёнными js/css.
4. **Кэширование.** HTML статической страницы (без `getServerSideProps`) кладётся в кэш по пути запроса —
   следующие запросы обслуживаются без рендера.
5. **Передача данных.** Начальные пропсы и `moduleId` страницы встраиваются в HTML как JSON-скрипты.
6. **Гидратация.** На клиенте `entry.client.tsx` читает `moduleId`, динамически импортирует нужную страницу
   и вызывает `hydrateRoot`, оборачивая её в тот же `_app.tsx`.

## Добавление новой страницы

1. Создайте файл в `src/pages`, например `src/pages/about.tsx` (→ `/about`) или `src/pages/users/[id].tsx`
   (→ `/users/:id`), с дефолтным экспортом компонента.
2. При необходимости экспортируйте `getServerSideProps` (данные на каждый запрос) **или** `getStaticProps`
   (данные один раз, дальше из кэша). Оба сразу экспортировать нельзя.
3. Готово — при следующей сборке страница автоматически попадёт в `_pageManifest.ts` и получит маршрут.

Пример с SSR:

```tsx
import { GetServerSideProps } from "@/shared/types";

type AboutPageProps = { title: string };

const AboutPage = ({ title }: AboutPageProps) => <h1>{title}</h1>;

export default AboutPage;

export const getServerSideProps: GetServerSideProps<AboutPageProps> = async ({ req, res }) => {
  return { props: { title: "About" } };
};
```

Пример со статикой:

```tsx
import { GetStaticProps } from "@/shared/types";

type PostPageProps = { title: string };

const PostPage = ({ title }: PostPageProps) => <h1>{title}</h1>;

export default PostPage;

// params — динамические сегменты маршрута, напр. { id: "1" } для /posts/1
export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  return { props: { title: `Post ${params.id}` } };
};
```
