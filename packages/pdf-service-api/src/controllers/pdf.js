const logger = require('../lib/logger');
const { toPDF } = require('../lib/pdfUtils');

module.exports = {
  async generatePdf(req, res) {
    logger.info('Generating pdf file from uploaded html file...');
    try {
      const { htmlFile } = req.files;
      const buffer = htmlFile.data;
      const pdf = await toPDF(buffer.toString());
      logger.debug(`Sending pdf file ${htmlFile.name}.pdf generated from html file ${htmlFile.name}`);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${htmlFile.name}.pdf"`);
      pdf.pipe(res);
    } catch (err) {
      logger.error(`Problem processing html file with error response:\n ${err}`);
      res.status(400).send({ code: 400, error: 'Provided html file was invalid' });
    }
  },
};
