#!/usr/bin/env tsx

/**
 * Команда content:home
 * Запускает build-home-content и валидирует результат
 */

import { execSync } from "child_process";
import {
  loadHomeContent,
  validateHomeContent,
  getContentStats,
} from "../lib/content";

async function main() {
  console.log("🚀 Запуск content:home...\n");

  try {
    // 1. Запуск build-home-content
    console.log("1️⃣  Сборка контента...");
    execSync("tsx scripts/build-home-content.ts", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log("\n2️⃣  Валидация контента...");

    // 2. Загрузка контента
    const content = loadHomeContent();

    // 3. Валидация
    const validation = validateHomeContent(content);

    if (!validation.valid) {
      console.error("\n❌ Валидация не прошла:");
      validation.errors.forEach((error) => console.error(`   - ${error}`));
      process.exit(1);
    }

    console.log("✅ Валидация прошла успешно");

    // 4. Печать статистики
    console.log("\n3️⃣  Статистика контента:");
    const stats = getContentStats(content);

    console.log(`   📋 Nav links: ${stats.navLinks}`);
    console.log(`   🖼️  Hero media: ${stats.heroMedia}`);
    console.log(`   📄 Sections: ${stats.sections}`);
    console.log(`   🌄 Total images: ${stats.totalImages}`);
    console.log(`   📌 Footer columns: ${stats.footerColumns}`);
    console.log(`   🔗 Footer links: ${stats.footerLinks}`);

    console.log("\n✅ content:home завершён успешно");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Ошибка:", error);
    process.exit(1);
  }
}

main();
