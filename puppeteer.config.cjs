const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Cambia la ubicación de la caché de Puppeteer a la raíz del proyecto
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};