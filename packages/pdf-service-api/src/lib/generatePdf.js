const puppeteer = require('puppeteer');
const logger = require('./logger');

const generatePdf = async (html) => {
  logger.info('Generating pdf');
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    });

    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      scale: 0.9,
    });

    await browser.close();

    logger.info('Sucessfully generated pdf');

    return pdfBuffer;
  } catch (err) {
    logger.error({ err }, 'Failed to generate pdf');
    throw new Error(err);
  }
};

module.exports = generatePdf;
