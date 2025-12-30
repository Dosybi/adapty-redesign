# Scraper Documentation

CLI-скрипт для извлечения контента с веб-страниц с помощью Playwright.

## Структура файлов

```
scripts/
├── scrape.js           # Основной скрипт
├── scrape.config.js    # Конфигурация
└── out/                # Директория для результатов
    ├── .gitkeep
    └── home.raw.json   # Сгенерированный файл (игнорируется git)
```

## Использование

### Базовый запуск

```bash
npm run scrape
```

### С другим URL

```bash
SCRAPE_URL=https://example.com npm run scrape
```

## Конфигурация (scrape.config.js)

```javascript
{
  url: "https://adapty.io/",           // URL для скрапинга
  viewport: { width: 1440, height: 900 }, // Размер viewport
  timeouts: {
    navigation: 60000,                  // Таймаут загрузки (мс)
    scroll: 500                         // Пауза между скроллами (мс)
  },
  scroll: {
    step: 500,                          // Пикселей за скролл
    maxScrolls: 100                     // Макс. число скроллов
  }
}
```

## Алгоритм работы

1. **Запуск Chromium браузера** (headless mode)
2. **Загрузка страницы** (waitUntil: domcontentloaded + 2s пауза)
3. **Автоскролл** - постепенный скролл вниз с паузами для загрузки lazy-элементов
4. **Извлечение данных** (параллельно):
   - Текстовые элементы (h1-h6, p, a, button, li, placeholders)
   - Изображения (img, picture > source)
   - Background images (CSS url(...))
5. **Фильтрация** - удаление скрытых элементов (display:none, opacity:0, etc.)
6. **Нормализация текста** - trim + схлопывание whitespace
7. **Сохранение в JSON**

## Формат выходного JSON

```json
{
  "meta": {
    "url": "https://adapty.io/",
    "capturedAt": "2025-12-30T06:11:27.659Z",
    "userAgent": "Mozilla/5.0...",
    "viewport": { "w": 1440, "h": 900 }
  },
  "textNodes": [
    {
      "kind": "heading|paragraph|link|button|listItem|placeholder",
      "tag": "H2",
      "text": "Revenue management...",
      "href": "...", // только для ссылок
      "ariaLabel": "...", // если есть
      "role": "...", // если есть
      "domPath": "h1, h2[1]"
    }
  ],
  "images": [
    {
      "url": "https://...",
      "alt": "...",
      "domPath": "img[0]",
      "width": 1200,
      "height": 630,
      "srcset": ["..."], // если есть
      "loading": "lazy" // если есть
    }
  ],
  "backgroundImages": [
    {
      "url": "https://...",
      "domPath": "div[42]",
      "tag": "DIV"
    }
  ]
}
```

## Обработка ошибок

- Скрипт не падает при ошибках извлечения отдельных элементов
- Логирует warnings в консоль
- Продолжает работу и сохраняет собранные данные
- Завершается с exit code 0 при успехе, 1 при критической ошибке

## Фильтрация видимости элементов

Элемент считается **невидимым** если:

- `display: none`
- `visibility: hidden`
- `opacity: 0`
- `offsetWidth === 0` или `offsetHeight === 0`

Такие элементы исключаются из результата.

## Расширение функционала

Для добавления новых селекторов редактируйте функцию `extractTextNodes()`:

```javascript
const selectors = {
  heading: "h1, h2, h3, h4, h5, h6",
  // ... добавьте свои
  customElement: "div[data-custom]",
};
```
