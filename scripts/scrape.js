#!/usr/bin/env node

/**
 * Playwright-скрипт для скрапинга веб-страниц
 * Извлекает тексты, ссылки, кнопки, изображения и background-images
 */

const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const config = require("./scrape.config");

/**
 * Нормализация текста: trim + схлопывание whitespace
 */
function normalizeText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Генерация стабильного DOM path для элемента
 * Формат: TAG:nth-child(N)#id.class или TAG:nth-child(N).class
 */
function getDomPath(selector, index = 0) {
  try {
    return `${selector}[${index}]`;
  } catch (error) {
    return `unknown[${index}]`;
  }
}

/**
 * Автоскролл страницы до конца
 */
async function autoScroll(page) {
  console.log("🔄 Автоскролл страницы...");

  try {
    await page.evaluate(
      async (scrollConfig) => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = scrollConfig.step;
          const maxScrolls = scrollConfig.maxScrolls;
          let scrollCount = 0;

          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            scrollCount++;

            // Достигли конца или превысили лимит
            if (totalHeight >= scrollHeight || scrollCount >= maxScrolls) {
              clearInterval(timer);
              resolve();
            }
          }, scrollConfig.scrollTimeout);
        });
      },
      {
        step: config.scroll.step,
        maxScrolls: config.scroll.maxScrolls,
        scrollTimeout: config.timeouts.scroll,
      }
    );

    // Небольшая пауза после скролла для рендеринга lazy-loaded элементов
    await page.waitForTimeout(1000);
    console.log("✅ Скролл завершён");
  } catch (error) {
    console.warn("⚠️  Ошибка при скролле:", error.message);
  }
}

/**
 * Извлечение всех текстовых элементов
 */
async function extractTextNodes(page) {
  console.log("📝 Извлечение текстовых элементов...");

  try {
    const textNodes = await page.evaluate(() => {
      const results = [];

      // Селекторы для разных типов элементов
      const selectors = {
        heading: "h1, h2, h3, h4, h5, h6",
        paragraph: "p",
        link: "a[href]",
        button: "button, [role='button']",
        listItem: "li",
        placeholder: "input[placeholder], textarea[placeholder]",
      };

      // Функция проверки видимости элемента
      function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          parseFloat(style.opacity) > 0 &&
          el.offsetWidth > 0 &&
          el.offsetHeight > 0
        );
      }

      // Извлечение для каждого типа
      Object.entries(selectors).forEach(([kind, selector]) => {
        const elements = document.querySelectorAll(selector);

        elements.forEach((el, index) => {
          if (!isVisible(el)) return;

          let text = "";
          let href = null;
          let ariaLabel = null;
          let role = null;

          // Получение текста в зависимости от типа
          if (kind === "placeholder") {
            text = el.getAttribute("placeholder") || "";
          } else {
            text = el.innerText || el.textContent || "";
          }

          text = text.replace(/\s+/g, " ").trim();
          if (!text || text.length === 0) return;

          // Дополнительные атрибуты
          if (kind === "link") {
            href = el.getAttribute("href");
          }

          ariaLabel = el.getAttribute("aria-label");
          role = el.getAttribute("role");

          results.push({
            kind,
            tag: el.tagName,
            text,
            href: href || undefined,
            ariaLabel: ariaLabel || undefined,
            role: role || undefined,
            domPath: `${selector}[${index}]`,
          });
        });
      });

      return results;
    });

    console.log(`✅ Найдено ${textNodes.length} текстовых элементов`);
    return textNodes;
  } catch (error) {
    console.warn("⚠️  Ошибка при извлечении текстов:", error.message);
    return [];
  }
}

/**
 * Извлечение всех изображений (img + picture > source)
 */
async function extractImages(page) {
  console.log("🖼️  Извлечение изображений...");

  try {
    const images = await page.evaluate(() => {
      const results = [];

      function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          parseFloat(style.opacity) > 0
        );
      }

      // Обычные <img>
      document.querySelectorAll("img").forEach((img, index) => {
        if (!isVisible(img)) return;

        const srcset = img.getAttribute("srcset") || "";
        const srcsetUrls = srcset
          ? srcset
              .split(",")
              .map((s) => s.trim().split(" ")[0])
              .filter(Boolean)
          : [];

        results.push({
          url: img.src || img.getAttribute("src") || "",
          alt: img.alt || "",
          domPath: `img[${index}]`,
          width: img.naturalWidth || 0,
          height: img.naturalHeight || 0,
          srcset: srcsetUrls.length > 0 ? srcsetUrls : undefined,
          loading: img.getAttribute("loading") || undefined,
        });
      });

      // <picture> > <source srcset>
      document.querySelectorAll("picture").forEach((picture, pIndex) => {
        if (!isVisible(picture)) return;

        picture.querySelectorAll("source[srcset]").forEach((source, sIndex) => {
          const srcset = source.getAttribute("srcset") || "";
          const srcsetUrls = srcset
            .split(",")
            .map((s) => s.trim().split(" ")[0])
            .filter(Boolean);

          srcsetUrls.forEach((url) => {
            results.push({
              url,
              alt: "",
              domPath: `picture[${pIndex}] > source[${sIndex}]`,
              width: 0,
              height: 0,
              srcset: [url],
            });
          });
        });
      });

      return results;
    });

    console.log(`✅ Найдено ${images.length} изображений`);
    return images;
  } catch (error) {
    console.warn("⚠️  Ошибка при извлечении изображений:", error.message);
    return [];
  }
}

/**
 * Извлечение CSS background-image для видимых элементов
 */
async function extractBackgroundImages(page) {
  console.log("🎨 Извлечение background-image...");

  try {
    const bgImages = await page.evaluate(() => {
      const results = [];

      function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          parseFloat(style.opacity) > 0
        );
      }

      function extractUrlsFromBackground(bgValue) {
        const urls = [];
        const regex = /url\(['"]?([^'"]+)['"]?\)/g;
        let match;
        while ((match = regex.exec(bgValue)) !== null) {
          urls.push(match[1]);
        }
        return urls;
      }

      const allElements = document.querySelectorAll("*");

      allElements.forEach((el, index) => {
        if (!isVisible(el)) return;

        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;

        if (bgImage && bgImage !== "none") {
          const urls = extractUrlsFromBackground(bgImage);

          urls.forEach((url) => {
            // Фильтр: только реальные изображения (не градиенты, не data:image/svg)
            if (
              url.startsWith("http") ||
              url.startsWith("/") ||
              url.startsWith("./")
            ) {
              results.push({
                url,
                domPath: `${el.tagName.toLowerCase()}[${index}]`,
                tag: el.tagName,
              });
            }
          });
        }
      });

      return results;
    });

    console.log(`✅ Найдено ${bgImages.length} background-image`);
    return bgImages;
  } catch (error) {
    console.warn("⚠️  Ошибка при извлечении background-image:", error.message);
    return [];
  }
}

/**
 * Главная функция скрапинга
 */
async function scrape() {
  console.log(`🚀 Запуск скрапинга: ${config.url}`);
  console.log(
    `📐 Viewport: ${config.viewport.width}x${config.viewport.height}\n`
  );

  let browser;
  let page;

  try {
    // Запуск браузера
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      viewport: {
        width: config.viewport.width,
        height: config.viewport.height,
      },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });

    page = await context.newPage();

    // Переход на страницу
    console.log("🌐 Загрузка страницы...");
    await page.goto(config.url, {
      waitUntil: "domcontentloaded",
      timeout: config.timeouts.navigation,
    });

    // Дополнительная пауза для загрузки динамического контента
    await page.waitForTimeout(2000);
    console.log("✅ Страница загружена\n");

    // Автоскролл
    await autoScroll(page);

    // Извлечение данных
    const [textNodes, images, backgroundImages] = await Promise.all([
      extractTextNodes(page),
      extractImages(page),
      extractBackgroundImages(page),
    ]);

    // Метаданные
    const meta = {
      url: config.url,
      capturedAt: new Date().toISOString(),
      userAgent: await page.evaluate(() => navigator.userAgent),
      viewport: {
        w: config.viewport.width,
        h: config.viewport.height,
      },
    };

    // Формирование результата
    const result = {
      meta,
      textNodes,
      images,
      backgroundImages,
    };

    // Сохранение в файл
    const outputDir = path.resolve(process.cwd(), config.output.dir);
    const outputPath = path.join(outputDir, config.output.filename);

    // Создание директории если не существует
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Создана директория: ${outputDir}`);
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");

    console.log(`\n✅ Данные сохранены: ${outputPath}`);
    console.log(`📊 Статистика:`);
    console.log(`   - Текстовых элементов: ${textNodes.length}`);
    console.log(`   - Изображений: ${images.length}`);
    console.log(`   - Background images: ${backgroundImages.length}`);

    await browser.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Критическая ошибка:", error.message);
    console.error(error.stack);

    if (browser) {
      await browser.close();
    }

    process.exit(1);
  }
}

// Запуск
scrape();
