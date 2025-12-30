/**
 * Пример использования утилиты assets.ts
 */

import { getAssetPath, hasAssetMapping, getAllMappings } from "../lib/assets";

// Пример 1: Получение локального пути для изображения
const imageUrl =
  "https://adapty.io/assets/uploads/2025/02/adapty-overview@2x.webp";
const localPath = getAssetPath(imageUrl);
console.log("Исходный URL:", imageUrl);
console.log("Локальный путь:", localPath);
console.log();

// Пример 2: Проверка существования маппинга
const hasMapping = hasAssetMapping(imageUrl);
console.log("Маппинг существует:", hasMapping);
console.log();

// Пример 3: Получение всех маппингов
const allMappings = getAllMappings();
console.log("Всего маппингов:", allMappings.size);
console.log();

// Пример 4: Fallback на исходный URL если маппинг не найден
const unknownUrl = "https://example.com/unknown-image.jpg";
const fallbackPath = getAssetPath(unknownUrl);
console.log("Неизвестный URL:", unknownUrl);
console.log("Fallback:", fallbackPath);
