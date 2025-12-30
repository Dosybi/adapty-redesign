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
- `npm run scrape` - запуск скрапера для извлечения контента с сайта

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

## Скрапер (Playwright)

В проекте есть CLI-скрипт для извлечения контента с веб-страниц с помощью Playwright.

### Использование

```bash
npm run scrape
```

По умолчанию скрапится https://adapty.io/. Для другого URL:

```bash
SCRAPE_URL=https://example.com npm run scrape
```

### Что извлекается

- **Тексты**: заголовки (h1-h6), параграфы, ссылки, кнопки, списки, плейсхолдеры
- **Ссылки**: все href с текстами
- **Кнопки**: тексты + атрибуты (type, aria-label, role)
- **Изображения**: `<img>` (src, alt, width, height, srcset, loading)
- **Picture sources**: `<picture> > <source srcset>`
- **Background images**: CSS `background-image: url(...)` для видимых элементов

### Результат

Данные сохраняются в `scripts/out/home.raw.json` в формате:

```json
{
  "meta": {
    "url": "...",
    "capturedAt": "...",
    "userAgent": "...",
    "viewport": { "w": 1440, "h": 900 }
  },
  "textNodes": [...],
  "images": [...],
  "backgroundImages": [...]
}
```

### Конфигурация

Редактируйте `scripts/scrape.config.js` для изменения:

- URL по умолчанию
- Размер viewport
- Таймауты
- Параметры скроллинга
