/**
 * Пример использования loadHomeContent
 */

import { loadHomeContent } from "../lib/content";

const content = loadHomeContent();

console.log("📄 Загруженный контент:\n");
console.log(`Hero Title: "${content.hero.title}"`);
console.log(`Nav Links: ${content.header.nav.length}`);
console.log(`Sections: ${content.sections.length}`);
console.log("\nПервая секция:");
console.log(`  - Key: ${content.sections[0].key}`);
console.log(`  - Title: ${content.sections[0].title}`);
console.log(`  - Items: ${content.sections[0].items?.length || 0}`);
