const puppeteer = require('puppeteer');
const logger = require('./logger');

const generatePdf = async (html) => {
  logger.info('Generating pdf');
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
      ],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
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
