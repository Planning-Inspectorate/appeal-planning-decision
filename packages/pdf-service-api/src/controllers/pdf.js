const generatePdf = require('../lib/generatePdf');
const logger = require('../lib/logger');

const postGeneratePdf = async (req, res) => {
  const {
    body: { html },
  } = req;

  logger.info({ body: req.body }, 'POST request to generate pdf');
  logger.debug(html, 'pdf html');
  logger.debug(html && html.toString(), 'pdf html string');

  try {
    const pdfBuffer = await generatePdf(html);
    res.contentType('application/pdf').send(pdfBuffer);
  } catch (err) {
    logger.error({ err }, 'Failed to download pdf');
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  postGeneratePdf,
};
