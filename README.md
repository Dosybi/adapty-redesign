# Adapty Marketing Website

Маркетинговый сайт на Next.js с App Router, TypeScript, Tailwind CSS и shadcn/ui.

## Требования

- Node.js 20+
- npm или yarn

## Установка

```bash
npm install
```

## Разработка

Запустить dev-сервер:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Команды

- `npm run dev` - запуск development сервера
- `npm run build` - сборка production версии
- `npm run start` - запуск production сервера
- `npm run lint` - проверка кода с ESLint
- `npm run format` - форматирование кода с Prettier

## Структура проекта

```
├── app/
│   ├── (marketing)/     # Главная страница
│   ├── blog/           # Блог
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Глобальные стили
├── components/         # React компоненты
│   └── ui/            # shadcn/ui компоненты
├── lib/               # Утилиты
├── scripts/           # Скрипты (парсеры и т.д.)
├── public/            # Статические файлы
└── ...config files
```

## Технологии

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Code Quality**: ESLint, Prettier

## Добавление shadcn/ui компонентов

```bash
npx shadcn@latest add button
npx shadcn@latest add card
# и т.д.
```

Компоненты будут добавлены в `components/ui/`.
