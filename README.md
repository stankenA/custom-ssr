# Custom SSR

Кастомный SSR-сервер на Node.js и React с поддержкой трёх стратегий рендеринга, гидратацией и файловой маршрутизацией.

## Стек

- **Runtime:** Node.js
- **Сервер:** Express 5
- **UI:** React 19 + TypeScript
- **Стили:** Tailwind CSS v4
- **Сборка клиента:** Vite 7
- **Архитектура фронтенда:** FSD (Feature-Sliced Design)

---

## Стратегии рендеринга

### ISR — Incremental Static Regeneration (`/`)

Главная страница. Первый запрос генерирует HTML и кладёт его в кэш. Последующие запросы отдают кэш. Если с момента последней генерации прошло более `ISR_REVALIDATE` мс — отдаётся старый кэш, а в фоне запускается перегенерация (Stale While Revalidate).

### SSG — Static Site Generation (`/static`)

Полностью статическая страница. HTML генерируется при первом запросе и кэшируется навсегда. Данные никогда не меняются.

### SSR — Server-Side Rendering (`/posts/:id`)

Динамическая страница. HTML генерируется на каждый запрос, данные берутся из внешнего API ([JSONPlaceholder](https://jsonplaceholder.typicode.com)).

---

## Гидратация

Сервер инжектирует в HTML два `<script type="application/json">`:

- `__page-name__` — имя компонента страницы
- `__initial-data__` — данные, с которыми был отрендерен сервер

Единственный клиентский бандл (`src/app/entry.client.tsx`) читает эти данные, динамически загружает нужный компонент через `import.meta.glob` и вызывает `hydrateRoot`.

---

## Структура проекта

```
src/
├── app/
│   └── entry.client.tsx        # единая точка входа для клиентского бандла
│
├── pages/
│   ├── main/
│   │   ├── index.tsx           # React-компонент (изоморфный)
│   │   └── index.server.tsx    # конфигурация маршрута (только сервер)
│   ├── posts/
│   │   ├── index.tsx
│   │   └── index.server.tsx
│   └── static/
│       ├── index.tsx
│       └── index.server.tsx
│
├── server/
│   ├── index.ts                # точка входа сервера
│   ├── app.ts                  # настройка Express
│   ├── env.ts                  # серверные переменные окружения
│   ├── cache.ts                # in-memory кэш
│   ├── render/
│   │   ├── render-page.tsx     # рендеринг React → HTML
│   │   └── assets.ts           # чтение Vite manifest
│   └── routes/
│       ├── create-page-handler.ts  # фабрика обработчиков страниц
│       ├── discover-pages.ts       # автообнаружение маршрутов
│       └── api/
│           └── index.ts            # CRUD-ручки
│
└── shared/
    ├── api/
    ├── config/                 # константы и shared-переменные окружения
    ├── html-template/          # HTML-обёртка для SSR
    ├── styles/                 # глобальные стили
    └── types/                  # общие TypeScript-типы
```

---

## Добавление новой страницы

1. Создать `src/pages/<name>/index.tsx` — React-компонент
2. Создать `src/pages/<name>/index.server.tsx` — конфигурация маршрута

Сервер автоматически обнаруживает `index.server.tsx` файлы при старте, клиентский бандл подхватывает компонент через `import.meta.glob`.

```ts
// src/pages/about/index.server.tsx
import { createPageHandler } from "@/server/routes";
import { AboutPage } from ".";

export default createPageHandler({
  route: "/about",
  strategy: "ssg",
  render: () => <AboutPage />,
});
```

---

## Переменные окружения

Создать `.env` в корне проекта:

```env
# только сервер
PORT=3000
ISR_REVALIDATE=6000

# доступны на сервере и клиенте (VITE_ префикс)
VITE_API_URL=https://jsonplaceholder.typicode.com
```

Серверные переменные (`PORT`, `ISR_REVALIDATE`) читаются через `process.env` в `src/server/env.ts`.
Общие переменные (`VITE_*`) читаются через `import.meta.env` в `src/shared/config/env.ts` — безопасны для браузера.

---

## Запуск

```bash
pnpm install
```

Для разработки нужно два терминала:

```bash
# Терминал 1 — первичная сборка клиента + watch
pnpm dev:client

# Терминал 2 — запустить после того, как Терминал 1 завершит первую сборку
pnpm dev:server
```

Для production-сборки клиентского бандла:

```bash
pnpm build
```

Сервер будет доступен по адресу `http://localhost:3000`.
