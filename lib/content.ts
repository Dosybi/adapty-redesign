/**
 * Утилиты для работы со структурированным контентом
 */

import * as fs from "fs";
import * as path from "path";
import type { HomeContent } from "./content.types";

/**
 * Загрузка контента главной страницы
 * @param contentFile - путь к файлу контента (по умолчанию content/home.json)
 * @returns структурированный контент главной страницы
 */
export function loadHomeContent(
  contentFile = "content/home.json"
): HomeContent {
  try {
    const fullPath = path.resolve(process.cwd(), contentFile);
    const data = fs.readFileSync(fullPath, "utf-8");
    const content: HomeContent = JSON.parse(data);

    return content;
  } catch (error) {
    throw new Error(
      `Failed to load home content from ${contentFile}: ${error}`
    );
  }
}

/**
 * Валидация контента
 */
export function validateHomeContent(content: HomeContent): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Проверка hero.title
  if (!content.hero?.title || content.hero.title.trim().length === 0) {
    errors.push("hero.title is empty or missing");
  }

  // Проверка базовых полей
  if (!content.header) {
    errors.push("header is missing");
  }

  if (!content.sections || content.sections.length === 0) {
    errors.push("sections is empty or missing");
  }

  if (!content.footer) {
    errors.push("footer is missing");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Получение статистики контента
 */
export function getContentStats(content: HomeContent) {
  const navLinks = content.header?.nav?.length || 0;
  const heroMedia = content.hero?.media?.length || 0;
  const sections = content.sections?.length || 0;

  // Подсчет всех изображений
  let totalImages = heroMedia;
  content.sections?.forEach((section) => {
    if (Array.isArray(section.items)) {
      section.items.forEach((item) => {
        if ("logoSrc" in item && item.logoSrc) totalImages++;
        if ("media" in item && Array.isArray(item.media))
          totalImages += item.media.length;
      });
    }
  });

  const footerColumns = content.footer?.columns?.length || 0;
  const footerLinks =
    content.footer?.columns?.reduce(
      (sum, col) => sum + (col.links?.length || 0),
      0
    ) || 0;

  return {
    navLinks,
    heroMedia,
    sections,
    totalImages,
    footerColumns,
    footerLinks,
  };
}
