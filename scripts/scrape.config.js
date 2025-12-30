/**
 * Конфигурация для скрапинга сайта
 */
module.exports = {
  // URL для скрапинга (можно переопределить через переменную окружения SCRAPE_URL)
  url: process.env.SCRAPE_URL || "https://adapty.io/",

  // Размер viewport
  viewport: {
    width: 1440,
    height: 900,
  },

  // Таймауты
  timeouts: {
    navigation: 60000, // 60 сек на загрузку страницы
    scroll: 500, // 500мс между скроллами
  },

  // Пути для вывода
  output: {
    dir: "scripts/out",
    filename: "home.raw.json",
  },

  // Настройки скроллинга
  scroll: {
    step: 500, // Пикселей за раз
    maxScrolls: 100, // Максимум попыток скролла
  },
};
