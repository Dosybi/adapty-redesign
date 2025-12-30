#!/usr/bin/env tsx

/**
 * Скрипт для трансформации raw данных в структурированный контент
 * Читает home.raw.json + home.assets.json → генерирует content/home.json
 */

import * as fs from "fs/promises";
import * as path from "path";
import type {
  HomeContent,
  Header,
  Hero,
  Section,
  Footer,
  Link,
  MediaItem,
  CTA,
} from "../lib/content.types";

// Конфигурация
const CONFIG = {
  rawFile: "scripts/out/home.raw.json",
  assetsFile: "scripts/out/home.assets.json",
  outputFile: "content/home.json",
};

interface RawTextNode {
  kind: string;
  tag: string;
  text: string;
  href?: string;
}

interface RawImage {
  url: string;
  alt: string;
}

interface RawData {
  textNodes: RawTextNode[];
  images: RawImage[];
  backgroundImages: Array<{ url: string }>;
}

interface AssetMapping {
  items: Array<{
    sourceUrl: string;
    localPath: string;
  }>;
}

/**
 * Маппинг ассетов
 */
class AssetMapper {
  private mapping = new Map<string, string>();

  constructor(assetsData: AssetMapping) {
    assetsData.items.forEach((item) => {
      this.mapping.set(item.sourceUrl, item.localPath);
    });
  }

  getLocalPath(sourceUrl: string): string {
    return this.mapping.get(sourceUrl) || sourceUrl;
  }
}

/**
 * Парсер контента
 */
class ContentParser {
  private textNodes: RawTextNode[];
  private images: RawImage[];
  private assetMapper: AssetMapper;

  constructor(rawData: RawData, assetMapper: AssetMapper) {
    this.textNodes = rawData.textNodes;
    this.images = rawData.images;
    this.assetMapper = assetMapper;
  }

  /**
   * Получение текстовых узлов по виду
   */
  private getNodesByKind(kind: string): RawTextNode[] {
    return this.textNodes.filter((node) => node.kind === kind);
  }

  /**
   * Получение заголовков
   */
  private getHeadings(): RawTextNode[] {
    return this.getNodesByKind("heading");
  }

  /**
   * Получение ссылок
   */
  private getLinks(): RawTextNode[] {
    return this.getNodesByKind("link").filter((node) => node.href);
  }

  /**
   * Получение параграфов
   */
  private getParagraphs(): RawTextNode[] {
    return this.getNodesByKind("paragraph");
  }

  /**
   * Парсинг Header
   */
  parseHeader(): Header {
    const links = this.getLinks();
    const nav: Link[] = [];
    let cta: CTA | undefined;

    // Ищем навигационные ссылки (обычно в начале)
    // Примерный эвристический подход: первые 10-15 ссылок часто относятся к навигации
    const navLinks = links.slice(0, 10).filter((link) => {
      const text = link.text.toLowerCase();
      // Исключаем CTA-подобные тексты
      return (
        !text.includes("get started") &&
        !text.includes("sign up") &&
        !text.includes("try") &&
        link.text.length > 0 &&
        link.text.length < 30
      );
    });

    navLinks.forEach((link) => {
      if (link.href) {
        nav.push({
          label: link.text,
          href: link.href,
        });
      }
    });

    // CTA обычно "Get Started", "Sign Up" и т.д.
    const ctaLink = links.find((link) => {
      const text = link.text.toLowerCase();
      return (
        text.includes("get started") ||
        text.includes("sign up") ||
        text.includes("start free")
      );
    });

    if (ctaLink && ctaLink.href) {
      cta = {
        label: ctaLink.text,
        href: ctaLink.href,
      };
    }

    return { nav, cta };
  }

  /**
   * Парсинг Hero
   */
  parseHero(): Hero {
    const headings = this.getHeadings();
    const paragraphs = this.getParagraphs();

    // Hero title обычно первый H1
    const h1 = headings.find((h) => h.tag === "H1");
    const title = h1?.text || "Welcome";

    // Subtitle - обычно первый параграф или H2
    const firstH2 = headings.find((h) => h.tag === "H2");
    const firstParagraph = paragraphs[0];
    const subtitle = firstH2?.text || firstParagraph?.text;

    // Media - первые несколько изображений
    const media: MediaItem[] = this.images.slice(0, 3).map((img) => ({
      src: this.assetMapper.getLocalPath(img.url),
      alt: img.alt || "",
    }));

    // CTA
    const links = this.getLinks();
    const primaryCtaLink = links.find((link) =>
      link.text.toLowerCase().includes("get started")
    );
    const secondaryCtaLink = links.find(
      (link) =>
        link.text.toLowerCase().includes("learn more") ||
        link.text.toLowerCase().includes("documentation")
    );

    const primaryCta = primaryCtaLink?.href
      ? { label: primaryCtaLink.text, href: primaryCtaLink.href }
      : undefined;

    const secondaryCta = secondaryCtaLink?.href
      ? { label: secondaryCtaLink.text, href: secondaryCtaLink.href }
      : undefined;

    return {
      title,
      subtitle,
      primaryCta,
      secondaryCta,
      media,
    };
  }

  /**
   * Парсинг секций
   */
  parseSections(): Section[] {
    const sections: Section[] = [];
    const headings = this.getHeadings();

    // Trusted By - обычно H2 с текстом "Trusted by"
    const trustedByHeading = headings.find((h) =>
      h.text.toLowerCase().includes("trusted by")
    );

    if (trustedByHeading) {
      sections.push({
        key: "trustedBy",
        title: trustedByHeading.text,
        items: this.images
          .filter((img) => img.url.includes("logo"))
          .slice(0, 10)
          .map((img) => ({
            label: img.alt || "Partner",
            logoSrc: this.assetMapper.getLocalPath(img.url),
          })),
      });
    }

    // Features - извлекаем секции по H2/H3
    const featureHeadings = headings.filter(
      (h) =>
        (h.tag === "H2" || h.tag === "H3") &&
        h !== trustedByHeading &&
        h.text.length > 10 &&
        h.text.length < 100
    );

    featureHeadings.slice(0, 5).forEach((heading) => {
      sections.push({
        key: "features",
        title: heading.text,
        items: [
          {
            title: heading.text,
            text:
              this.getParagraphs().find((p) => p.text.length > 20)?.text ||
              "Feature description",
            bullets: [],
          },
        ],
      });
    });

    return sections;
  }

  /**
   * Парсинг Footer
   */
  parseFooter(): Footer {
    const links = this.getLinks();

    // Footer обычно содержит ссылки в конце страницы
    // Группируем по предполагаемым колонкам
    const footerLinks = links.slice(-20); // Последние 20 ссылок

    const columns: Footer["columns"] = [
      {
        title: "Product",
        links: footerLinks
          .filter((link) => {
            const text = link.text.toLowerCase();
            return (
              text.includes("feature") ||
              text.includes("pricing") ||
              text.includes("sdk")
            );
          })
          .slice(0, 5)
          .map((link) => ({
            label: link.text,
            href: link.href!,
          })),
      },
      {
        title: "Company",
        links: footerLinks
          .filter((link) => {
            const text = link.text.toLowerCase();
            return (
              text.includes("about") ||
              text.includes("contact") ||
              text.includes("blog")
            );
          })
          .slice(0, 5)
          .map((link) => ({
            label: link.text,
            href: link.href!,
          })),
      },
    ];

    return { columns };
  }

  /**
   * Генерация полного контента
   */
  build(): HomeContent {
    return {
      header: this.parseHeader(),
      hero: this.parseHero(),
      sections: this.parseSections(),
      footer: this.parseFooter(),
    };
  }
}

/**
 * Главная функция
 */
async function main() {
  console.log("🏗️  Сборка структурированного контента...\n");

  try {
    // Чтение raw данных
    console.log(`📖 Чтение ${CONFIG.rawFile}...`);
    const rawData: RawData = JSON.parse(
      await fs.readFile(CONFIG.rawFile, "utf-8")
    );

    console.log(`📖 Чтение ${CONFIG.assetsFile}...`);
    const assetsData: AssetMapping = JSON.parse(
      await fs.readFile(CONFIG.assetsFile, "utf-8")
    );

    // Создание маппера
    const assetMapper = new AssetMapper(assetsData);

    // Парсинг контента
    console.log("🔨 Парсинг контента...");
    const parser = new ContentParser(rawData, assetMapper);
    const content = parser.build();

    // Создание директории для контента
    const outputDir = path.dirname(CONFIG.outputFile);
    await fs.mkdir(outputDir, { recursive: true });

    // Сохранение
    await fs.writeFile(
      CONFIG.outputFile,
      JSON.stringify(content, null, 2),
      "utf-8"
    );

    console.log(`\n✅ Контент успешно собран: ${CONFIG.outputFile}`);
    console.log("\n📊 Статистика:");
    console.log(`   - Nav links: ${content.header.nav.length}`);
    console.log(`   - Hero title: "${content.hero.title}"`);
    console.log(`   - Hero media: ${content.hero.media.length}`);
    console.log(`   - Sections: ${content.sections.length}`);
    console.log(`   - Footer columns: ${content.footer.columns.length}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Ошибка:", error);
    process.exit(1);
  }
}

// Запуск
main();
