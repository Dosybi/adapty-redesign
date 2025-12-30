# История промптов

## 1

Ты — senior frontend engineer. Инициализируй новый проект для маркетингового сайта на Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.

Требования:
• Node 20+.
• App Router, TypeScript.
• Tailwind настроен.
• shadcn/ui установлен и работает.
• Светлая тема по умолчанию (no dark mode пока).
• Базовые страницы: / и /blog (пока пустые, но с layout).
• Линт/формат: ESLint + Prettier.
• Структура каталогов:
• app/(marketing)/page.tsx для главной
• app/blog/page.tsx
• components/ (пока пусто)
• lib/ (утилиты)
• scripts/ (будущий парсер Playwright)
• Добавь README.md с командами установки/запуска.

    Не добавляй никаких заглушек-демо кроме минимального layout.

## 2

Добавь в проект Playwright (Chromium) и сделай CLI-скрипт в /scripts, который:
• Открывает https://adapty.io/
• Дожидается загрузки (networkidle)
• Автоскроллит страницу до конца, чтобы подгрузились lazy-элементы
• Извлекает: 1. все видимые тексты из h1..h6, p, li, a, button, элементы с role=“button” и input/textarea placeholder (если есть), 2. все ссылки (href) и тексты ссылок, 3. все кнопки (текст + атрибуты type/aria-label), 4. все <img> (src, alt, width/height, loading, srcset если есть), 5. все картинки из <source srcset> внутри <picture>, 6. все CSS background-image url(…) для видимых элементов (computedStyle).
• Сохраняет результат в scripts/out/home.raw.json.

Формат JSON:

```
{
  "meta": { "url": "...", "capturedAt": "...", "userAgent": "...", "viewport": { "w": 1440, "h": 900 } },
  "textNodes": [
    { "kind": "heading|paragraph|link|button|listItem|placeholder|other", "tag": "H2", "text": "...", "href": "...?", "ariaLabel": "...?", "role": "...?", "domPath": "..." }
  ],
  "images": [
    { "url": "...", "alt": "...", "domPath": "...", "width": 0, "height": 0, "srcset": ["..."] }
  ],
  "backgroundImages": [
    { "url": "...", "domPath": "...", "tag": "DIV" }
  ]
}
```

Технические требования:
• Запуск: npm scrape.
• URL, который мы скрапим, должен настраиваться в отдельном конфиге или через переменную. По умолчанию https://adapty.io/
• Нормализуй текст: trim + схлопывание whitespace.
• Фильтруй мусор: пустые строки, скрытые элементы, элементы с opacity=0, display:none, visibility:hidden.
• domPath сделай стабильным (например: tag:nth-child + id/class если есть). Достаточно приближенно, но повторяемо.
• Никаких зависимостей кроме Playwright и стандартных node libs, если не критично.

Важно: скрипт должен быть надежным и не падать, даже если какие-то элементы не читаются — логируй warning и продолжай.

## 3

На основе scripts/out/home.raw.json добавь второй скрипт scripts/download-assets.ts, который:
• Читает raw json
• Собирает уникальные URL картинок из images[].url, images[].srcset[], backgroundImages[].url
• Скачивает их в public/remote-assets/
• Формирует scripts/out/home.assets.json вида:

```
    {
  "downloadedAt": "...",
  "items": [
    { "sourceUrl": "...", "localPath": "/remote-assets/....ext", "contentType": "...?", "bytes": 12345, "sha256": "..." }
  ]
}
```

    •	Делает стабильные имена файлов:
    •	по hostname + pathname (санитизировать)
    •	если коллизия — добавь короткий hash
    •	Игнорирует data: URL (не скачивать), но сохраняет как есть в маппинге.

Требования:
• Ограничь параллелизм (например 6–10 потоков).
• Если скачивание не удалось — записывай в отчёт failed[], но скрипт должен завершаться успешно.
• Добавь команду assets:home.

Дополнительно:
• Сделай небольшую утилиту lib/assets.ts, которая по sourceUrl возвращает localPath из маппинга (fallback на исходный url).

Выведи изменения package.json.

## 4

Добавь скрипт scripts/build-home-content.ts, который превращает home.raw.json + home.assets.json в content/home.json со структурой:

```
{
  "header": { "nav": [{ "label": "...", "href": "..." }], "cta": { "label": "...", "href": "..." } },
  "hero": { "title": "...", "subtitle": "...", "primaryCta": "...", "secondaryCta": "...?", "media": [{ "src": "...", "alt": "..." }] },
  "sections": [
    { "key": "trustedBy", "title": "...?", "items": [{ "label": "...", "logoSrc": "..." }] },
    { "key": "features", "title": "...", "items": [{ "title": "...", "text": "...", "bullets": ["..."] }] }
  ],
  "footer": { "columns": [{ "title": "...", "links": [{ "label": "...", "href": "..." }] }] }
}
```

Все изображения прогоняй через маппинг sourceUrl → localPath.

Добавь типы lib/content.types.ts и функцию loadHomeContent() которая читает content/home.json.

Добавь короткую проверку pnpm content:home которая:
• запускает build-home-content
• валидирует что hero.title не пустой
• печатает summary в консоль (сколько nav links, сколько images, сколько sections).

## 5

Сверстай Hero секцию главной страницы. Стиль:
https://linear.app/
https://attio.com/
https://polar.sh
https://vercel.com/
Светлая тема, чистая типографика, много воздуха, тонкие бордеры, мягкие тени. Хэдер пока пропускаем: делаем только hero-блок внутри страницы.

Данные (источник контента)
Контент уже подготовлен в content/home.json и выглядит так:

"hero": {
"banner": {
"mark": "Ebook",
"link": {
"label": "$100K playbook | download",
"href": "https://adapty.io/ebooks/100k-app-playbook/"
}
},
"title": "Revenue management for in-app purchases",
"subtitle": "Save months on integrating subscriptions and double your app revenue with paywall management.",
"primaryCta": { "label": "Start for free", "href": "/" },
"secondaryCta": { "label": "Book a demo", "href": "/" },
"media": [
{ "src": "https://adapty.io/assets/uploads/2025/02/adapty-paywall-demo-preview@2x.webp", "alt": "" },
{ "src": "https://adapty.io/assets/uploads/2025/02/adapty-overview@2x.webp", "alt": "" }
]
}

Твоя задача — взять текст/ссылки/картинки из этого JSON и собрать секцию.

⸻
Визуальная цель

Hero состоит из одной колонки 1. Вверху “pill” баннер:
• слева маленький бейдж “Ebook”
• справа ссылка “$100K playbook | download” + маленькая стрелка/chevron
• pill с тонким бордером, лёгким фоном, аккуратными hover-состояниями

    2.	Большой заголовок (H1) — очень крупный, плотный, аккуратный (как на linear/attio)
    3.	Подзаголовок (p) — спокойный, ширина ограничена, хороший line-height
    4.	CTA-блок как в продакшн лендингах:
    •	Инпут “Email address”
    •	Кнопка primary “Start for free” внутри группы (справа)
    •	Отдельно вторичная кнопка/ссылка “Book a demo” рядом (на десктопе в одной строке; на мобилке — ниже или рядом, но не ломать)

Ниже — media-композиция:
• Большая карточка с “dashboard/overview” изображением (hero.media[1]) — как большой скрин в белой карточке, округление, мягкая тень.
• Поверх/слева — телефон (hero.media[0]) как меньшая карточка/телефон-скрин, с сильнее выраженной тенью и небольшим “вылетом” из карточки.
• Это должно выглядеть как аккуратная layered композиция: никаких кислотных градиентов, только чистый UI.

⸻

Технические требования 1. shadcn/ui:
• Используй Badge, Button, Input из shadcn.
• Иконки — lucide-react (например ChevronRight).

    2.	Компонентный подход:
    •	Создай components/sections/HeroSection.tsx.
    •	Hero должен принимать hero как проп (типизированный), не импортировать JSON внутри себя.
    •	На странице app/(marketing)/page.tsx импортируй loadHomeContent() (или текущий loader) и передай content.hero в HeroSection.

    3.	Разметка и семантика:
    •	Hero оборачиваем в <section> с aria-labelledby="hero-title".
    •	Заголовок — <h1 id="hero-title">.
    •	Кнопки/ссылки — корректные: Button asChild + Link (Next Link).
    •	Инпут должен иметь доступность (хотя бы aria-label="Email address").

    4.	SSR/SSG:
    •	Никаких client hooks, никакого useEffect. Компонент должен быть server-compatible.
    •	Контент должен попадать в HTML при билде.

    5.	Изображения:
    Если используешь next/image, тогда либо добавь remotePatterns в next.config, либо ставь unoptimized на Image.
    В любом случае: округления, тени, правильные размеры, без CLS (задай размеры/аспект).

⸻

Адаптив (обязательно)
• Mobile (<= 640):
• всё в одну колонку
• pill → title → subtitle → CTA → media
• CTA: input + primary button в две строки (или input сверху, кнопка снизу), secondary CTA ниже как link/button
• media: карточка по ширине экрана, телефон оверлеем, но не перекрывать важное
• Desktop (>= 1024):
• 2 колонки grid-cols-2
• текст слева фиксированной ширины, media справа
• хорошие отступы: hero должен выглядеть “дорого”, не тесно

⸻

Стайл-гайды
• Фон секции: очень светлый нейтральный (не чисто белый), можно bg-muted/20.
• Border: тонкие, полупрозрачные.
• Тени: мягкие, без грязи.
Типографика:
• H1: крупный, tight tracking, line-height плотный
• subtitle: спокойный text-muted-foreground, max-width
• Hover/focus состояния для кнопок и ссылки в pill.
• Используй container/max-w-6xl + px-4 sm:px-6 lg:px-8.

⸻

Deliverables: 1. components/sections/HeroSection.tsx — основной компонент 2. (Если нужно) components/layout/container.tsx и/или components/layout/section.tsx — простые переиспользуемые обёртки (Container/Section), чтобы дальше собирать остальные секции единообразно. 3. Обнови app/(marketing)/page.tsx, чтобы рендерить HeroSection с данными из content/home.json. 4. Убедись, что импортированы shadcn компоненты (Badge, Button, Input) и lucide-react.

⸻

Сначала сделай верстку hero “в черновик, но уже красиво”, затем пройди второй раз и отполируй spacing/typography/shadows/hover/focus.

## 6

Нужно улучшить уже сверстанный HeroSection.

Цели изменений 1. Сделать компоновку hero “вертикальной” на десктопе, как на Linear:
• сверху — баннер pill + заголовок + подзаголовок + CTA,
• ниже — медиа-композиция (dashboard + phone) как единый hero visual, можно с лёгким наклоном. 2. Убрать толстые рамки вокруг изображений. Никаких “толстых белых карточек/рамок”. Допустимы:
• border 1px (очень тонкий, полупрозрачный),
• shadow мягкий,
• rounded аккуратный. 3. Сохранить стиль “attio/linear/vercel/polar”, но светлая тема.

Контент bспользуй hero из content/home.json (тот же, что сейчас).

⸻

Требования к новой разметке

Desktop (>= 1024)
• Hero секция в одну колонку:
• Верхний блок текста: max-w-3xl (или max-w-4xl), выравнивание по левому краю или “слегка центрированно” (но текст обычно лучше left).
• Отступы: много воздуха (верх/низ секции щедро).
• CTA блок:
• “Email address” + primary “Start for free” как единая группа (Input + Button).
• Secondary “Book a demo” рядом на одной линии (как ghost/link).
• Ниже текста — HeroMedia:
• Визуально: большой dashboard-скрин с лёгким наклоном + поверх/слева phone-скрин.
• Наклон очень умеренный (буквально 6–10deg), чтобы не выглядело “игровым”.
• Композиция должна быть устойчивой и не разваливаться при изменении ширины.

Mobile (<= 640)
• Всё в столбик:
• текст → CTA → media
• Наклон/перспектива либо отключить, либо сильно уменьшить (чтобы не обрезалось).
• Media не должна выходить за экран и не должна закрывать текст.
⸻

Архитектура компонентов 1. Вынеси медиа в отдельный компонент:
• components/sections/hero/hero-media.tsx
• HeroMedia({ phone, dashboard }) где phone = hero.media[0], dashboard = hero.media[1]

    2.	HeroSection отвечает только за layout и передачу данных.
    3.	Используй shadcn:
    •	Badge, Button, Input
    •	Button asChild + Link для ссылок
    •	Иконка ChevronRight в pill.

В next/image — проверь, что нет обёртки с padding, которая создаёт вид рамки.

## 7

Нужно сверстать секцию TrustedBy для главной страницы. Секция должна быть визуально очень чистой (attio/linear/vercel/polar), светлая тема, нейтральные серые логотипы, много воздуха.

Данные приходят из content/home.json:
"trustedBy": {
"title": "Trusted by 15,000+ apps and the world's largest app publishers",
"items": [
{ "alt": "Feeld", "logoSrc": "https://adapty.io/assets/uploads/2024/01/logo-feeld-gray.svg" },
{ "alt": "Bumble", "logoSrc": "https://adapty.io/assets/uploads/2024/01/logo-bumble-gray.svg" },
{ "alt": "Weewoo", "logoSrc": "https://adapty.io/assets/uploads/2025/02/weewoo.svg" },
{ "alt": "AppNation", "logoSrc": "https://adapty.io/assets/uploads/2025/02/AppNation.webp" },
{ "alt": "Almus", "logoSrc": "https://adapty.io/assets/uploads/2025/02/almus.svg" },
{ "alt": "Impala Studios", "logoSrc": "https://adapty.io/assets/uploads/2024/01/logo-text-impala-studios-gray.svg" },
{ "label": "HubX", "logoSrc": "https://adapty.io/assets/uploads/2024/01/logo-hubx-gray.svg" }
]
}

В items может быть alt или label — нужно корректно сформировать alt:
• altText = item.alt ?? item.label ?? "Logo".

⸻

Задача 1. Создай компонент TrustedBySection в components/sections/TrustedBySection.tsx. 2. Компонент принимает проп trustedBy (типизированный), не импортирует JSON внутри. 3. Подключи его на странице (в page.tsx) сразу под hero.

⸻

Визуальные требования
• Фон совпадает.
• Заголовок: по центру, text-sm/text-base, text-muted-foreground, лёгкий вес.
• Логотипы: в одну строку на десктопе, равномерно распределены, серые, без рамок, без карточек.
• Между логотипами — одинаковые интервалы.
• Высота логотипов приведена к одной. Никаких “гигантских” webp.
• Логотипы не должны “мерцать” или прыгать (задай размеры контейнеров).

⸻

Адаптив
Desktop (>= 1024)
• Заголовок по центру.
• Под ним — горизонтальная строка логотипов.
• Можно сделать layout через flex:
• flex items-center justify-center gap-x-10 (примерно)
• Если не помещаются — допускается лёгкий wrap на 2 строки, но предпочтительнее: уместить в одну строку при max-w контейнера.

Mobile (<= 640)
Сделай один из вариантов (выбери самый аккуратный):
• Вариант A (предпочтительный): горизонтальный скролл логотипов (без видимых скроллбаров) — выглядит как modern SaaS.
• Вариант B: сетка 2–3 колонки, 2–3 строки, аккуратно центрировано.

Сделай A, если получится быстро и красиво:
• контейнер overflow-x-auto
• snap-x snap-mandatory
• скрыть скроллбар утилитой (можно через CSS class в globals, без библиотек)
⸻

Технические детали / качество 1. SVG + WEBP:
• logoSrc может быть .svg или .webp.
• Атрибуты:
• loading="lazy"
• decoding="async"
• alt={altText}

    2.	Выравнивание размеров:
    •	Установи единый height через класс.
    •	Чтобы логотипы были одинаково “плотными”, заверни каждый в контейнер фиксированной высоты и центрируй по вертикали.

    3.	Лёгкое “приглушение”:
    •	Должно быть серым/нейтральным. Можно:
    •	opacity-70 hover:opacity-100

    4.	Компонентность:
    •	Сделай маленький компонент LogoItem внутри файла (не обязательно отдельный файл), чтобы аккуратно нормализовать alt/label и классы.
    •	Можно добавить cn утилиту.

Код SSR-friendly, без client hooks.

Сделай сначала аккуратную версию без лишних эффектов, затем отполируй spacing (gap, отступы сверху/снизу) и hover-состояния.

## 8

Нужно сверстать секцию Help (“Help your team run…”), стиль: attio/linear/vercel/polar, светлая тема, аккуратные отступы, тонкие бордеры, мягкие тени.
Ключевое: каждая карточка целиком кликабельна (Link), а “заголовок-кнопка” — это визуальная часть внутри карточки.

Данные
Бери из content/home.json:

"help": {
"title": "Help your team run the mobile subscription business. Faster and cheaper.",
"items": [
{
"imageSrc": "https://adapty.io/assets/uploads/2025/02/img-card-cover-sdk-install@2x.webp",
"button": { "label": "For developers", "href": "#" },
"bullets": ["Subscriptions SDK","Refund Saver","Remote config","Fallback paywalls"]
},
{
"imageSrc": "https://adapty.io/assets/uploads/2025/02/img-card-cover-charts@2x.webp",
"button": { "label": "For app owners", "href": "#" },
"bullets": ["Revenue analytics","LTV analytics","AI LTV and revenue predictions"]
},
{
"imageSrc": "https://adapty.io/assets/uploads/2025/02/img-card-cover-paywalls@2x.webp",
"button": { "label": "For marketers", "href": "#" },
"bullets": ["A/B testing","No-code Builder","Localizations","Targeting"]
}
]
}

⸻

Компоненты и файлы 1. Создай components/sections/HelpSection.tsx (server-compatible). 2. Внутри вынеси маленький компонент HelpCardLink (можно в том же файле) для одной карточки. 3. Подключи HelpSection на главной после TrustedBy.

Shadcn
• Используй Badge (для буллетов-чипсов) или Button variant=“secondary” size=“sm” только если это выглядит как chip, без “кнопочности”.
• Для стрелки используй lucide-react (ChevronRight).

⸻

Визуальные требования
Фон секции
• Эта секция должна слегка отличаться от предыдущих двух по фону, но без контраста.
• Сделай так:
• outer section: bg-muted/20 (или bg-muted/15)
• плюс border-y border-border/40 (очень тонко)
• Внутри: normal container.

Заголовок
• По центру, max-w-3xl, крупный, но не огромный:
• text-3xl sm:text-4xl font-semibold tracking-tight
• Межстрочный чуть плотный.

Карточки (вся карточка кликабельна)
• Каждая карточка — Link (Next Link) с aria-label вида "{label}".
• Внутри карточки: 1. сверху изображение (cover) :
• rounded-2xl overflow-hidden
• border border-border/40 (опционально)
• shadow-sm (опционально) 2. ниже — строка “заголовка” (это не отдельная кнопка):
• text-base font-medium
• рядом иконка стрелки, которая чуть смещается на hover 3. ниже — bullets как чипсы (Badge variant="secondary" или кастомный pill):
• компактные, wrap, одинаковый стиль.

Hover/Focus анимация
• На hover:
• карточка поднимается на 1–2px (-translate-y-0.5 или -translate-y-1)
• бордер усиливается: border-border/70
• тень чуть сильнее: shadow-md (но мягко)
• Плавность:
• transition-all duration-200 ease-out
• На focus-visible:
• обязательно ring: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2

Важно: никаких “толстых рамок” вокруг картинки. Никаких p-4 белых подложек как паспарту.
⸻

Mobile
• grid-cols-1
• Изображение сверху, далее заголовок, чипсы.

Acceptance criteria
• Секция визуально отличается фоном очень мягко.
• 3 карточки, каждая целиком кликабельна.
• Hover: плавный подъём 1–2px + бордер заметнее + мягкая тень.
• Внутри карточек: cover image без толстых рамок, затем “кликабельный заголовок” с стрелкой, затем bullets-чипсы.
• Мобилка: аккуратный стек, всё читаемо, нет переполнений.
• SSR: без client hooks.

Сначала реализуй структуру и стили, затем второй проход: подбери аспекты картинок и отступы, чтобы карточки выглядели одинаково «дорого».

## 9

Нужно сверстать секцию SlaSection в стиле attio/linear/vercel/polar, светлая тема, минимализм, много воздуха. Фон секции должен совпадать с предыдущей секцией Help (тот же bg-muted/20).

Данные
Бери из content/home.json:
"sla": {
"title": "Adapty processes subscription revenue with the industry’s highest SLA Rate",
"items": [
{ "amount": "$2B", "description": "tracked revenue" },
{ "amount": "99.99%", "description": "historical uptime" },
{ "amount": "2.5B", "description": "users served" },
{ "amount": "60B", "description": "API calls / month" }
]
}

⸻

Компоненты и файлы 1. Создай components/sections/SlaSection.tsx. 2. Компонент принимает проп sla. 3. Подключи секцию сразу после Help.

⸻

Визуальные требования
Общий вид
• Заголовок — по центру, max-w-4xl, аккуратная типографика, близко к Linear:
• text-2xl sm:text-3xl lg:text-4xl
• font-semibold tracking-tight
• line-height плотный, чтобы смотрелось “собранно”.

Метрики
• 4 метрики в ряд на десктопе.
• Цифры крупные, ориентир:
• text-4xl sm:text-5xl lg:text-6xl
• font-semibold или font-bold (без лишней тяжести)
• Под цифрой — подпись:
• text-sm sm:text-base
• text-muted-foreground
• Выравнивание по центру, но можно центр + ровные интервалы.

⸻

Семантика и доступность
• Оберни в <section aria-labelledby="sla-title">
• Заголовок <h2 id="sla-title">
• Метрики можно как <dl>:
• amount → <dd>
• description → <dt>
⸻

Компонентность
• Внутри файла сделай SlaMetric (маленький компонент), чтобы:
• не дублировать классы
• легко менять типографику позже.
⸻

Deliverables
• components/sections/SlaSection.tsx
• Подключение в app/(marketing)/page.tsx

## 10

Нужно сверстать секцию CodeSection на главной странице маркетингового сайта в стиле attio/linear/vercel/polar (светлая тема). Секция показывает заголовок/описание/CTA, testimonial-карточку и справа (или ниже на мобилке) — код-сниппеты с переключателем языков.

Контент
Используй объект code из content/home.json:

```
"code": {
"title": "Integrate in-app purchases with a few lines of code",
"description": "Integrate IAPs within a few hours without server coding. Adapty handles the correct subscription state, taking everything under the hood, from free trials to refunds, in a simple, developer-friendly SDK.",
"button": { "label": "Make subscriptions easy", "href": "#" },
"testimonial": {
"quote": "Adapty SDK made integrating in-app purchases a walk in the park. With just a few lines of code, I was able to implement subscriptions seamlessly for both iOS and Android.",
"author": "Magnús Ólafsson",
"role": "Chief Technology Officer at Smitten",
"avatarSrc": "https://adapty.io/assets/uploads/2024/02/Magnus-Olafsson-Smitten@2x.webp",
"logoSrc": "https://adapty.io/assets/uploads/2024/02/Smitten_Color-Logo-Small-02.webp"
},
"snippets": [
{ "id": "swift", "label": "Swift", "language": "swift", "code": "..." },
{ "id": "kotlin", "label": "Kotlin", "language": "kotlin", "code": "..." },
{ "id": "react-native", "label": "React Native", "language": "javascript", "code": "..." },
{ "id": "flutter", "label": "Flutter", "language": "dart", "code": "..." },
{ "id": "unity", "label": "Unity", "language": "csharp", "code": "..." }
]
}
```

⸻

Дизайн-цели

1. Вокруг кода — stage-подложка как у Polar: мягкий градиент + сильное скругление, но без кричащих цветов.
2. Переключатель языков — пилюли (shadcn ToggleGroup), расположен над кодом отдельной маленькой панелью (не “шапка IDE”).
3. Подсветка синтаксиса — Shiki (server-side). 4. Вся секция заметно темнее по цвету чем предыдущая, но не чёрная: аккуратный негрязный серый.
   ⸻

Архитектура (SSR + маленький client island)
Сделай так, чтобы клиентским был только переключатель (и copy).

Файлы/компоненты

1. components/sections/code-section/code-section.tsx — server component
   • получает проп code (тип)
   • рендерит левую колонку (title/description/cta/testimonial)
   • рендерит справа CodeShowcase (client island), но без передачи “сырого” HTML с dangerouslySetInnerHTML на клиент, если можно. 2. components/sections/code-section/code-showcase.client.tsx — client component
   • управляет выбором snippet (state)
   • показывает pill-переключатель
   • показывает code card и copy button
   • получает на вход массив snippets уже с подсвеченным HTML (или подсвечивает на сервере через пропы) 3. lib/shiki.ts — утилита подсветки
   • highlight(code: string, lang: string): Promise<string> → возвращает HTML для <code> (без внешних обёрток) или полный <pre> (на твой выбор)
   • используй Shiki с светлой темой (например github-light или vitesse-light)
   • кэшируй highlighter (singleton), чтобы не инициализировать на каждый вызов 4. lib/code-snippets.ts — helper
   • преобразует code.snippets в snippetsWithHtml, где у каждого есть highlightedHtml
   ⸻

Layout
Desktop (>= 1024)
• 2 колонки:
• слева: текст + testimonial (max-w)
• справа: stage + code card
• Grid: grid-cols-2 gap-10 lg:gap-14

Mobile
• Всё в столбик:
• текст → CTA → testimonial → stage + code
• pills должны скроллиться горизонтально, если не помещаются.

⸻

Визуал: Stage + Code card
Stage (подложка)
• большой контейнер: rounded-[32px] p-4 sm:p-6
• фон: очень аккуратный градиент, например:
• bg-gradient-to-br from-indigo-100/60 via-sky-100/40 to-pink-100/50
• или более нейтральный: from-slate-100/60 via-indigo-100/30 to-slate-100/60
• можно добавить ring-1 ring-border/30 или border border-border/30 (очень тонко)
• не делай тёмных заливок вообще

Code card (внутри stage)
• bg-background
• border border-border/40
• shadow-sm или shadow-md (мягко)
• rounded-2xl
• overflow-hidden

ToggleGroup pills
• располагай над code card в отдельной “пилюльной панели”:
• контейнер: inline-flex rounded-full bg-background/70 backdrop-blur border border-border/40 p-1 shadow-sm
• внутри ToggleGroup:
• item: rounded-full px-3 py-1.5 text-sm text-muted-foreground
• active: bg-background shadow-sm text-foreground
• на мобилке: оборачивай в overflow-x-auto и скрывай скроллбар

Code area
• Моношрифт: font-mono text-sm leading-relaxed
• Padding: p-4 sm:p-5
• Добавь лёгкую “строчную сетку” можно через bg-[linear-gradient(...)] очень осторожно — но можно вообще без неё, чтобы не утяжелять.
• Ограничь высоту: max-h-[360px] sm:max-h-[420px] overflow-auto (иначе будет огромный блок)

Copy button
• маленькая иконка в правом верхнем углу code card:
• Button variant="ghost" size="icon" или просто button
• aria-label="Copy code"
• на клик копирует текущий snippet
• Иконка: Copy из lucide-react

⸻

Testimonial card (слева)
Сделай аккуратную карточку:
• bg-background/60 border border-border/40 rounded-2xl p-6 shadow-sm
• внутри:
• логотип (маленький) сверху слева
• quote с кавычками (можно “ как текст)
• внизу: avatar + author/role
⸻

Shiki: реализация подсветки

Требования: 1. Подсветка происходит на сервере. 2. В code-section.tsx заранее подготовь snippetsWithHtml = await Promise.all(...). 3. В клиентский компонент передаёшь { id, label, language, code, highlightedHtml }.

⸻

Доступность и SEO
• <section aria-labelledby="code-title">
• <h2 id="code-title">
• ToggleGroup должен быть доступным:
• type="single", value, onValueChange
• Code block:
• <pre aria-label="Code snippet">
• Copy button:
• aria-label="Copy code"

⸻

SSG/SSR ограничения
• Никаких запросов на клиенте.
• Client island только для:
• переключения snippet
• copy-to-clipboard
• Контент (title/description/testimonial) — серверный.
• Кодовые сниппеты и подсветка — серверная, чтобы при build view-source был понятный HTML.

## 11

Доработай Code area, чтобы размер окна с кодом не изменялся при переключении вкладок и не выходил за правую границу экрана. Высота тоже не должна меняться, чтобы ToggleGroup не прыгали и оставались на одном месте. Сделай Stage подложку ярче.

## 12

Реализуй секцию FeaturesShowcase для главной страницы. Стиль: светлый, минималистичный, premium (attio/linear/vercel/polar). Контент берём из массива features в content/home.json (см. ниже). Делаем скролл-шоукейс: слева sticky навигатор по фичам, справа — последовательность feature-стейджей, каждый почти на высоту экрана. При скролле активный пункт навигации подсвечивается (scrollspy). Цитата/тестимониал рендерится опционально (есть не у всех фич).

Данные
Используй features:

```
"features": [
{
"title": "Increase subscription revenue without app releases",
"description": "Manage, target, localize and personalize paywalls without leaving your browser.",
"cta": { "label": "Increase app revenue", "href": "#" },
"imageSrc": "https://adapty.io/assets/uploads/2025/05/paywall-ab-testing@2x.webp",
"testimonial": {
"quote": "“Whether it's A/B testing paywalls, predicting LTV, or analyzing subscription metrics, Adapty is the ultimate toolkit for app success.”",
"author": "Ilgar Tali",
"role": "Founder & Chief Vision Officer",
"avatarSrc": "https://adapty.io/assets/uploads/2024/02/Ilgar-Tali-Smartist@2x.webp",
"logoSrc": "https://adapty.io/assets/uploads/2024/03/logo-smartist-black@2x.png"
}
},
{
"title": "Cut refund rate by 40%",
"description": "Stop losing revenue on refunds – Adapty automatically shares user activity data with Apple for refund requests and reduces it.",
"cta": { "label": "Set up Refund Saver", "href": "#" },
"imageSrc": "https://adapty.io/assets/uploads/2025/05/refund-rate@2x-1024x768.webp",
"testimonial": {
"quote": "“I never thought that doing something about refunds could make such a difference. We just flipped the switch, set it up, and suddenly, it felt like we stopped letting money slip away.”",
"author": "Berk Çağatay Albayrak",
"role": "Sr. Product Manager",
"avatarSrc": "https://adapty.io/assets/uploads/2024/12/avatar-berk-cagatay-gray@3x.webp",
"logoSrc": "https://adapty.io/assets/uploads/2024/12/app-icon-fotorama-original.webp"
}
},
{
"title": "Know your subscription numbers at any moment",
"description": "Measure your in-app economy from trials to refunds with a ready-to-go, real-time subscription BI.",
"cta": { "label": "See subscription BI", "href": "#" },
"imageSrc": "https://adapty.io/assets/uploads/2024/01/app-monetization-strategies@2x.webp",
"testimonial": {
"quote": "“Adapty's analytics provides invaluable insights into our app's performance. With detailed real-time metrics like revenue, ARPU, and churn rate, we make informed decisions to optimize our monetization strategy.”",
"author": "Nikolay Chebotarev",
"role": "Head of UA at Moonly.app",
"avatarSrc": "https://adapty.io/assets/uploads/2024/02/Nikolay.png",
"logoSrc": "https://adapty.io/assets/uploads/2023/12/app_icon_Moonly.svg"
}
},
{
"title": "No-code paywall builder",
"description": "Build beautiful native paywalls for iOS, Android, Flutter, and React Native without a dev team.",
"cta": { "label": "Create paywalls within minutes", "href": "#" },
"imageSrc": "https://adapty.io/assets/uploads/2024/01/no-code-paywall-builder@2x.webp",
"testimonial": {
"quote": "“Adapty’s Paywall Builder and A/B testing tools paired together are a game changer for anyone trying to do high-velocity testing and find quick wins.”",
"author": "Mike McSweeney",
"role": "Chief Product Officer",
"avatarSrc": "https://adapty.io/assets/uploads/2024/02/Mike-McSweeney-Moodworks-inc@2x.webp",
"logoSrc": "https://adapty.io/assets/uploads/2024/02/app-icon-cat.png"
}
},
{
"title": "Boost app revenue fast with web funnels",
"description": "Build and launch web-to-app funnels, integrate payments, optimize with A/B testing and scale globally — all in one platform, no coding needed.",
"cta": { "label": "Explore FunnelFox", "href": "#" },
"imageSrc": "https://adapty.io/assets/uploads/2025/04/funnelfox-feature@2x-768x631.webp"
}
]
```

⸻

Архитектура компонентов (server + маленький client scrollspy) 1. components/sections/features/FeaturesSection.tsx — server component
• рендерит layout: слева навигатор, справа список feature-блоков (каждый имеет id)
• передаёт в client-компонент только “метаданные” (ids/titles) и ссылку на контейнер/селекторы 2. components/sections/features/features-nav.client.tsx — client component
• отвечает за scrollspy (IntersectionObserver)
• подсвечивает активный пункт
• по клику скроллит к соответствующему блоку (smooth scroll)
• на мобилке превращается в горизонтальные “пилюли” (scrollable) 3. components/sections/features/feature-stage.tsx — server component
• один feature-блок: текст + cta + опциональный testimonial + справа stage с картинкой 4. components/sections/features/feature-testimonial.tsx — server component
• рендерится только если testimonial есть

⸻

Sticky nav
• nav wrapper: sticky top-24 (или top-20 если хедер фиксированный)
• список как “текстовые кнопки” в стиле Linear:
• активный: лёгкая плашка bg-muted/40, тонкий бордер border-border/40
• неактивный: hover подсветка
• каждый пункт: title (2 строки максимум), маленький номер/точка опционально (можно без)

⸻

Content (справа): последовательность “стейджей”

Каждый feature-блок занимает почти экран:
• outer: min-h-[70vh] flex items-center (на lg можно 75–85vh)
• внутри: grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center

Текстовая часть
• h3 крупный: text-3xl sm:text-4xl font-semibold tracking-tight
• description: mt-3 text-base sm:text-lg text-muted-foreground
• CTA: не обязательно настоящая кнопка; лучше как Link в стиле “text link + arrow”:
• inline-flex items-center gap-2 font-medium
• иконка ArrowRight с лёгким сдвигом на hover
• Testimonial (опционально) под CTA:
• карточка bg-background/60 border border-border/40 rounded-2xl p-6 shadow-sm
• маленький logo сверху
• quote текст
• автор: avatar + имя/роль

Stage с картинкой
• сделать “Polar-like stage” как ты уже используешь в CodeSection, но проще:
• wrapper: rounded-[28px] p-4 sm:p-6
• фон: мягкий tint/градиент (очень аккуратно)
• внутри изображение на белой карточке:
• bg-background border border-border/40 rounded-2xl shadow-sm overflow-hidden
• важно: не делать толстых рамок вокруг картинки.
• <img> (SSR-friendly): loading="lazy" decoding="async" alt=""
• фиксируем aspect, чтобы не прыгало:
• aspect-[16/10] или подбирать по картинке (допустимо оставить w-full h-auto если stable)

Цвета stage (чтобы не было монотонности, но без хаоса)

Сделай лёгкую систему tint по индексу:
• 0: from-emerald-100/60 via-slate-100/30 to-emerald-100/40
• 1: from-mint-100/70 via-slate-100/30 to-mint-100/40 (или teal)
• 2: from-violet-100/60 via-slate-100/30 to-violet-100/40
• 3: from-rose-100/60 via-slate-100/30 to-rose-100/40
• 4: нейтральный from-slate-100/60 via-slate-100/30 to-slate-100/60
Это должны быть очень мягкие оттенки, чтобы не спорить с общей светлой темой.

⸻

Mobile поведение
• Sticky nav отключаем.
• Сверху секции показываем горизонтальные pills (как у code переключателя):
• overflow-x-auto no-scrollbar
• на клик — scrollIntoView соответствующего блока.
• Feature-блоки становятся обычным вертикальным списком:
• сначала текст, потом stage с картинкой
• testimonial (если есть) остаётся под текстом.

⸻

Scrollspy (client)

Используй IntersectionObserver:
• target: каждый feature-блок имеет id вида feature-0, feature-1, …
• observer options:
• root: null
• rootMargin: "-40% 0px -55% 0px" (чтобы активным становился блок в центре)
• threshold: [0, 0.2, 0.5]
При пересечении обновляй activeId.

По клику:
• document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
• учти sticky header: можно добавить scroll-mt-24 на секции feature, чтобы заголовок не уезжал под хедер.

⸻

Семантика и доступность
• <section aria-labelledby="features-title"> (можно добавить общий заголовок секции, даже если в контенте его нет — например “Features” / “What you can do” — но если ты не хочешь добавлять новый текст, можно скрытый sr-only).
• nav элементы: button или a с aria-current="true" для активного.
• focus styles: focus-visible:ring-2 ring-ring ring-offset-2

⸻

Deliverables 1. FeaturesSection.tsx (server) 2. features-nav.client.tsx (client scrollspy + click scroll) 3. feature-stage.tsx (server) 4. feature-testimonial.tsx (server, optional) 5. Подключение FeaturesSection на главной после CodeSection

## 13

Нужно полностью переделать секцию Features: убрать текущий sticky-nav/вертикальные стейджи и заменить на горизонтальную ленту карточек (scroll-snap) в стиле Linear (но в светлой теме, premium/минималистично, shadcn).

Входные данные
Используй features из content/home.json:

```
"features": {
"title": "Features",
"items": [ /* ... */ ]
}
```

testimonial опциональный — рендерим только если есть.
⸻

Что нужно удалить/заменить

1. Удали/выведи из page.tsx/layout старую реализацию:

   • sticky навигацию
   • IntersectionObserver scrollspy
   • “экраны”/стейджи на всю высоту

2. Удали неиспользуемые файлы.

⸻

Новый UI: FeaturesRail (горизонтальный скролл)

Верх секции
• Секция: светлая, чистая, py-16 sm:py-20
• Контейнер: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
• Заголовок слева: h2 = features.title (“Features”)

Rail (горизонтальная лента)
• Ниже заголовка: горизонтальный scroll container:
• overflow-x-auto
• scroll-snap-type: x mandatory
• scrollbar скрыть (no-scrollbar)
• padding слева/справа, чтобы карточки “дышали”: px-4 sm:px-6 lg:px-8 (либо через контейнер + отрицательные отступы)
• Карточки идут в ряд и уходят за правую границу экрана.
• Каждая карточка snap-start, ширина:
• mobile: w-[88vw]
• tablet: w-[70vw]
• desktop: w-[min(920px,75vw)]
• Gap между карточками: gap-6

Управление стрелками
• Внизу по центру или справа: две кнопки prev/next (shadcn Button variant="secondary" или outline")
• Кнопки скроллят rail на 1 карточку (smooth).
• Это будет минимальный client island.
⸻

Карточка FeatureCard (внутри rail)
Карточка — это один “витринный экран” фичи. Внутри 2 колонки:

Card shell
• bg-background border border-border/40 rounded-[28px] shadow-sm
• padding: p-6 sm:p-8
• hover (десктоп): карточка приподнимается на 1–2px + бордер чуть контрастнее + тень мягче/чуть сильнее:
• transition-all duration-200 ease-out
• hover:-translate-y-[1px] hover:shadow-md hover:border-border/60
• Важно: никаких “толстых рамок”.

Внутренний layout
• grid grid-cols-1 lg:grid-cols-2 gap-8 items-center
• Слева: Stage с картинкой
• Справа: Title / description / CTA / (optional testimonial)

ВЫажно: Картинки занимают всю высоту карточки.

⸻

Контент справа
• Title: text-2xl sm:text-3xl font-semibold tracking-tight
• Description: mt-3 text-muted-foreground text-base sm:text-lg
• CTA: как текстовая ссылка (не тяжёлая кнопка), “как у Linear”:
• Link + ArrowRight (lucide)
• hover: стрелка чуть уезжает вправо
• Testimonial (опционально):
• компактная карточка внутри feature card (ниже CTA)
• bg-muted/20 border border-border/40 rounded-2xl p-5
• сверху logo (маленький, h-6 w-auto)
• quote: ограничить по строкам line-clamp-4 (если есть line-clamp), чтобы не раздувало
• автор: avatar + имя/роль
• Если testimonial отсутствует — просто не рендери блок, чтобы верстка не ломалась.

⸻

Мобильная адаптация
• Карточка становится вертикальной:
• картинка сверху
• текст снизу
• Rail остаётся свайпабельным, с snap.
• Стрелки можно скрыть на мобилке.

⸻

Реиспользование и shadcn
• Используй shadcn:
• Button для стрелок
• можно Card не использовать (проще кастом div), но стили делаем как у Card
• Сделай небольшую компонентную структуру:

Предложенная структура файлов
• components/sections/features/features-rail.tsx (server) — секция: заголовок + rail + controls
• components/sections/features/feature-card.tsx (server) — карточка
• components/sections/features/feature-testimonial.tsx (server) — опциональная цитата
• components/sections/features/rail-controls.client.tsx (client) — prev/next, получает containerId или ref через id
• components/sections/features/rail.utils.ts (optional) — функция getTintClasses(index)

⸻

Клиентский код (минимум)

Только RailControls:
• находит контейнер по id="features-rail"
• scrollBy({ left: container.clientWidth _ 0.9, behavior: "smooth" }) на next
• scrollBy({ left: -container.clientWidth _ 0.9, behavior: "smooth" }) на prev
• disable кнопок не обязателен, но nice-to-have: если scrollLeft в начале/конце.

⸻

Семантика/SEO
• <section aria-labelledby="features-title">
• <h2 id="features-title">Features</h2>
• карточки не должны быть интерактивными целиком (только CTA-ссылка), чтобы не было ложной кликабельности.

⸻

Сначала реализуй базовую версию (rail + cards + snap). Затем добавь polish: tints, hover, стрелки навигации.

## 14

Нужно добавить отдельную секцию Integrations на главной странице. Следуй тем же дизайн-принипам, что и в других секциях.

В content/home.json есть:

```
"integrations": {
"title": "Sync purchase data with other services",
"description": "Forward subscription events to analytics and attribution services without coding.",
"cta": { "label": "Explore integrations", "href": "#" },
"testimonial": {
"quote": "“They have a great external API ...”",
"author": "Chris Bick",
"role": "Founder and CEO",
"avatarSrc": "https://adapty.io/assets/uploads/2024/01/avatar-chris-bick.webp",
"logoSrc": "https://adapty.io/assets/uploads/2023/12/logo-bickster.png"
},
"items": [{ "logoSrc": "...", "alt": "..." }]
}
```

⸻

Размести секцию после FeaturesRail.

2. Структура компонентов
   Создай компоненты:
   • components/sections/integrations/integrations-section.tsx (server)
   • components/sections/integrations/integration-testimonial.tsx (server)
   • components/sections/integrations/integrations-grid.tsx (server)
   • components/shared/logo-tile.tsx (server, переиспользуемый)

Подключи IntegrationsSection в home page и передай туда integrations из JSON.
⸻

3. Разметка секции (семантика + контейнер)

Семантика и SEO:
• <section aria-labelledby="integrations-title">
• h2 с id="integrations-title" берётся из integrations.title
⸻

4. Верх:
   2 колонки (текст слева, цитата справа)

Сделай сетку:
• grid grid-cols-1 lg:grid-cols-12 gap-8 items-start

Левая колонка (контент)
• lg:col-span-7
• Заголовок:
• h2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight
• Описание:
• mt-4 text-base sm:text-lg text-muted-foreground max-w-prose
• CTA:
• делаем лёгкую кнопку, shadcn Button:
• variant="outline" (или secondary, если так лучше ложится в твою тему)
• справа ArrowRight (lucide)
• className="mt-6"
• Ссылка может быть href="#" (логика кликов не важна)

Правая колонка — testimonial card.
⸻

5. Низ: logo grid (стена логотипов)

Ниже верхней части:
• mt-10 sm:mt-12

Grid
• grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4
• Рендерим integrations.items.map(...)

LogoTile (переиспользуемый)
Каждый логотип — небольшой “tile”:
• container:
• h-12 sm:h-14 rounded-xl bg-background border border-border/40 flex items-center justify-center px-3
• hover:
• transition-all duration-200 ease-out
• hover:-translate-y-[1px] hover:shadow-sm hover:border-border/60
• img:
• max-h-6 sm:max-h-7 w-auto
• opacity-80 hover:opacity-100 transition
• alt обязателен
• не инвертировать цвета логотипов и не накладывать фильтры. Только opacity.
⸻

6. Адаптив
   • На мобилке порядок:
   1. title/description/button
   2. testimonial
   3. grid
      • На десктопе: две колонки + grid снизу.
      • Никаких фиксированных высот, чтобы не было пустоты.

⸻

7. Требования к стилю
   • Светлая тема.
   • Тонкие бордеры: border-border/40, усиление на hover до /60
   • Никаких толстых рамок вокруг картинок/логотипов.
   ⸻

8. Acceptance criteria
   • Секция визуально собранная: слева заголовок+описание+CTA, справа цитата с аватаром и логотипом.
   • Ниже аккуратный stage с сеткой логотипов.
   • Всё адаптивно.
   • Компоненты разнесены по папкам,

## 15

Реализуй секцию testimonials. Сделай сетку из вертикальных карточек.

Входные данные
Используем данные из content.json (или где у нас хранится контент):

```
"testimonials": {
"title": "Developers from all kind of apps move to Adapty to grow their revenue",
"items": [
{ "quote": "...", "author": "...", "role": "...", "avatarSrc": "...", "logoSrc": "..." }
]
}
```

⸻

Дизайн и поведение

1. Секция
   • Секция на тёмном, но не чёрном фоне.
   • Верх секции: заголовок h2 (center на мобилке, left на десктопе — по стилю остальных секций).

2. Сетка
   Нужен masonry-эффект (карточки разной высоты), чтобы не было больших пустот.
   • Реализуй через CSS columns (надёжно и быстро):
   • columns-1 на мобилке
   • sm:columns-2
   • lg:columns-3
   • У карточек: break-inside-avoid и отступ снизу, чтобы они не “ломались”.

Пример контейнера:
• className="columns-1 sm:columns-2 lg:columns-3 [column-gap:1.5rem]"

Карточка:
• className="mb-6 break-inside-avoid"

3.  Карточка отзыва
    Сделай компонент TestimonialCard на shadcn Card.
    Структура карточки:
    • Верх: маленький аватар автора (круглый), не огромный (32–40px).
    • Текст цитаты — основной акцент. Хорошая читабельность: text-sm/6 или text-[15px] leading-6, цвет text-foreground/80.
    • Низ карточки — “footer”:
    • слева: имя автора (semi-bold) + роль (muted)
    • справа или снизу: логотип компании (маленький), но визуально опрятный.

        Цвет карточки тоже тёмный, но чуть светлее фона.

4.  Адаптив
    • На мобилке: 1 колонка, комфортные паддинги, карточки на всю ширину.
    • На десктопе: 3 колонки, лимит по ширине секции как у остальных блоков.
    ⸻

Реализация (код-структура)

Компоненты 1. components/sections/testimonials/testimonials-section.tsx

    •	серверный компонент (если можно), получает content.testimonials.

    2.	components/sections/testimonials/testimonial-card.tsx

    •	карточка (лучше server component, без стейта).

Обнови типы.

## 16

Нужно сверстать секцию Enterprise: аккуратная типографика, еле заметные разделители, без карточных эффектов.

Входные данные в home.json.

Требования к дизайну 1. Контейнер секции
Фон: светлый как в большинстве секций.

    2.	Заголовок
    •	По центру.

    3.	Сетка 3 колонки
    •	Desktop: 3 колонки, равные.
    •	Mobile: 1 колонка.

    4.	Вертикальные разделители
    •	На lg между колонками должны быть тонкие вертикальные линии.
    •	Делай не через border на колонках (чтобы не было проблем с высотой), а отдельным элементом-линией:
    •	absolute top-0 bottom-0 w-px bg-border/40
    •	позиционируй между колонками (пример: внутри relative-контейнера).
    •	На mobile/tablet не показывать разделители.

    5.	Контент внутри колонок
    •	Заголовок колонки: text-lg font-semibold.
    •	Список: mt-5 space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed.
    •	Не используй маркеры <ul className="list-disc"> — лучше чистый вертикальный список (как у Linear).
    •	Для каждой строки — отдельный <p> или <div>.

    6.	Акцент на “99.99% SLA”
    •	Если emphasis === "underline" — делай underline underline-offset-4 decoration-border/70 и text-foreground.
    •	Если "bold" — font-medium text-foreground.
    •	Если "pill" — маленький pill через Badge из shadcn, но по умолчанию тут ожидаем underline.

    7.	Анимации
    •	Никаких “карточек” и ховеров на этот блок.
    •	Разделители и типографика статичны.

Требования к компонентной структуре

Сделай переиспользуемо:
• components/sections/enterprise/EnterpriseSection.tsx — секция целиком.
• EnterpriseColumn.tsx — отрисовка одной колонки (title + items).
• Типы: EnterpriseSectionProps на основе контента.
• Не дублируй layout-логику в колонке: колонка должна быть “тупой”, без знания про разделители.
