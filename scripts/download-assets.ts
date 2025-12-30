#!/usr/bin/env tsx

/**
 * Скрипт для скачивания ассетов из home.raw.json
 * Скачивает изображения и формирует маппинг sourceUrl -> localPath
 */

import * as fs from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";
import pLimit from "p-limit";

// Конфигурация
const CONFIG = {
  inputFile: "scripts/out/home.raw.json",
  outputFile: "scripts/out/home.assets.json",
  outputDir: "public/remote-assets",
  concurrency: 8, // Количество параллельных загрузок
  timeout: 30000, // Таймаут для каждой загрузки (30 сек)
};

interface RawData {
  images: Array<{
    url: string;
    srcset?: string[];
  }>;
  backgroundImages: Array<{
    url: string;
  }>;
}

interface AssetItem {
  sourceUrl: string;
  localPath: string;
  contentType?: string;
  bytes: number;
  sha256: string;
}

interface AssetMapping {
  downloadedAt: string;
  items: AssetItem[];
  failed: Array<{
    sourceUrl: string;
    error: string;
  }>;
}

/**
 * Нормализация URL: удаление query params и fragments для стабильного имени
 */
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

/**
 * Генерация стабильного имени файла из URL
 * Формат: hostname/path-sanitized.ext
 */
function generateFileName(url: string, usedNames: Set<string>): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/[^a-z0-9-]/gi, "_");
    const pathname = parsed.pathname;

    // Извлечение расширения
    const ext = path.extname(pathname) || ".bin";
    const basename = path.basename(pathname, ext).replace(/[^a-z0-9-]/gi, "_");

    // Генерация базового имени
    let filename = `${hostname}_${basename}${ext}`;

    // Проверка на коллизию
    if (usedNames.has(filename)) {
      // Добавляем короткий hash
      const hash = crypto
        .createHash("md5")
        .update(url)
        .digest("hex")
        .slice(0, 8);
      filename = `${hostname}_${basename}_${hash}${ext}`;
    }

    usedNames.add(filename);
    return filename;
  } catch {
    // Для невалидных URL используем hash
    const hash = crypto.createHash("md5").update(url).digest("hex");
    return `unknown_${hash}.bin`;
  }
}

/**
 * Скачивание файла с retry
 */
async function downloadFile(
  url: string,
  outputPath: string
): Promise<{ bytes: number; contentType?: string; sha256: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || undefined;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Вычисление SHA256
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");

    // Сохранение файла
    await fs.writeFile(outputPath, buffer);

    clearTimeout(timeout);
    return {
      bytes: buffer.length,
      contentType,
      sha256,
    };
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

/**
 * Извлечение уникальных URL из raw.json
 */
function extractUniqueUrls(data: RawData): string[] {
  const urls = new Set<string>();

  // Из images[].url
  data.images?.forEach((img) => {
    if (img.url && !img.url.startsWith("data:")) {
      urls.add(img.url);
    }

    // Из images[].srcset[]
    img.srcset?.forEach((srcUrl) => {
      if (srcUrl && !srcUrl.startsWith("data:")) {
        urls.add(srcUrl);
      }
    });
  });

  // Из backgroundImages[].url
  data.backgroundImages?.forEach((bg) => {
    if (bg.url && !bg.url.startsWith("data:")) {
      urls.add(bg.url);
    }
  });

  return Array.from(urls);
}

/**
 * Главная функция
 */
async function main() {
  console.log("🚀 Запуск скачивания ассетов...\n");

  try {
    // Чтение raw.json
    console.log(`📖 Чтение ${CONFIG.inputFile}...`);
    const rawData: RawData = JSON.parse(
      await fs.readFile(CONFIG.inputFile, "utf-8")
    );

    // Извлечение уникальных URL
    const urls = extractUniqueUrls(rawData);
    console.log(`✅ Найдено ${urls.length} уникальных URL\n`);

    // Фильтрация data: URLs (не скачиваем, но сохраняем в маппинг)
    const dataUrls = urls.filter((url) => url.startsWith("data:"));
    const downloadableUrls = urls.filter((url) => !url.startsWith("data:"));

    console.log(`📥 К скачиванию: ${downloadableUrls.length}`);
    console.log(`🔗 Data URLs (не скачиваем): ${dataUrls.length}\n`);

    // Создание директории для ассетов
    await fs.mkdir(CONFIG.outputDir, { recursive: true });

    // Маппинг и список ошибок
    const items: AssetItem[] = [];
    const failed: Array<{ sourceUrl: string; error: string }> = [];
    const usedNames = new Set<string>();

    // Ограничение параллелизма
    const limit = pLimit(CONFIG.concurrency);

    // Скачивание файлов
    const downloadTasks = downloadableUrls.map((url) =>
      limit(async () => {
        const filename = generateFileName(url, usedNames);
        const localPath = `/remote-assets/${filename}`;
        const outputPath = path.join(CONFIG.outputDir, filename);

        try {
          console.log(`⬇️  ${url}`);
          const { bytes, contentType, sha256 } = await downloadFile(
            url,
            outputPath
          );

          items.push({
            sourceUrl: url,
            localPath,
            contentType,
            bytes,
            sha256,
          });

          console.log(`✅ ${filename} (${(bytes / 1024).toFixed(1)} KB)`);
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          console.warn(`⚠️  Не удалось скачать ${url}: ${errorMsg}`);
          failed.push({ sourceUrl: url, error: errorMsg });
        }
      })
    );

    // Ждём завершения всех загрузок
    await Promise.all(downloadTasks);

    // Добавляем data: URLs в маппинг (без скачивания)
    dataUrls.forEach((url) => {
      items.push({
        sourceUrl: url,
        localPath: url, // data: URLs возвращаются как есть
        bytes: 0,
        sha256: "",
      });
    });

    // Формирование результата
    const result: AssetMapping = {
      downloadedAt: new Date().toISOString(),
      items,
      failed,
    };

    // Сохранение маппинга
    await fs.writeFile(
      CONFIG.outputFile,
      JSON.stringify(result, null, 2),
      "utf-8"
    );

    // Финальная статистика
    console.log(`\n✅ Скачивание завершено!`);
    console.log(`📊 Статистика:`);
    console.log(`   - Успешно: ${items.length - dataUrls.length}`);
    console.log(`   - Data URLs: ${dataUrls.length}`);
    console.log(`   - Ошибок: ${failed.length}`);
    console.log(`   - Итого в маппинге: ${items.length}`);
    console.log(`\n💾 Маппинг сохранён: ${CONFIG.outputFile}`);

    if (failed.length > 0) {
      console.log(
        `\n⚠️  Не удалось скачать ${failed.length} файлов (см. failed[] в JSON)`
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Критическая ошибка:", error);
    process.exit(1);
  }
}

// Запуск
main();
