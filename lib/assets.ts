/**
 * Утилита для работы с ассетами
 * Позволяет получить локальный путь по sourceUrl из маппинга
 */

import * as fs from "fs";
import * as path from "path";

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
  failed?: Array<{
    sourceUrl: string;
    error: string;
  }>;
}

// Кэш маппинга
let mappingCache: Map<string, string> | null = null;

/**
 * Загрузка маппинга из JSON файла
 */
function loadMapping(
  mappingFile = "scripts/out/home.assets.json"
): Map<string, string> {
  if (mappingCache) {
    return mappingCache;
  }

  try {
    const fullPath = path.resolve(process.cwd(), mappingFile);
    const data = fs.readFileSync(fullPath, "utf-8");
    const mapping: AssetMapping = JSON.parse(data);

    mappingCache = new Map();
    mapping.items.forEach((item) => {
      mappingCache!.set(item.sourceUrl, item.localPath);
    });

    return mappingCache;
  } catch (error) {
    console.warn(`⚠️  Не удалось загрузить маппинг: ${error}`);
    return new Map();
  }
}

/**
 * Получение локального пути по sourceUrl
 * @param sourceUrl - исходный URL ассета
 * @param mappingFile - путь к файлу маппинга (опционально)
 * @returns локальный путь или исходный URL если маппинг не найден
 */
export function getAssetPath(sourceUrl: string, mappingFile?: string): string {
  const mapping = loadMapping(mappingFile);
  return mapping.get(sourceUrl) || sourceUrl;
}

/**
 * Сброс кэша маппинга (полезно для тестов)
 */
export function clearMappingCache(): void {
  mappingCache = null;
}

/**
 * Проверка существования маппинга для URL
 */
export function hasAssetMapping(
  sourceUrl: string,
  mappingFile?: string
): boolean {
  const mapping = loadMapping(mappingFile);
  return mapping.has(sourceUrl);
}

/**
 * Получение всех маппингов
 */
export function getAllMappings(mappingFile?: string): Map<string, string> {
  return loadMapping(mappingFile);
}
