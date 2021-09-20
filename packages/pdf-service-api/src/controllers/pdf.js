const puppeteer = require('puppeteer');
const logger = require('../lib/logger');
// const toPDF = require('../lib/pdfUtils');

module.exports = {
  async generatePdf(req, res) {
    logger.info('Generating pdf file from uploaded html file...');
    try {
      const { htmlFile } = req.files;
      const buffer = htmlFile.data;

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--disable-extensions'],
        headless: true,
      });
      const page = await browser.newPage();
      const base64 = Buffer.from(buffer, 'utf8').toString('base64');

      await page.goto(`data:text/html;UTF-8;base64,${base64}`);

      console.log(buffer);
      const pdfFile = await page.pdf();
      await browser.close();

      console.log(pdfFile);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${htmlFile.name}.pdf"`);
      res.pipe(pdfFile);

      // return
      //       const pdf = await toPDF(buffer.toString());
      //       logger.debug(`Sending pdf file ${htmlFile.name}.pdf generated from html file ${htmlFile.name}`);
      //       res.setHeader('Content-Type', 'application/pdf');
      //       res.setHeader('Content-Disposition', `attachment; filename="${htmlFile.name}.pdf"`);
      //       pdf.pipe(res);
    } catch (err) {
      logger.error(`Problem processing html file with error response:\n ${err}`);
      res.status(400).send('Provided html file was invalid');
    }
  },
};
