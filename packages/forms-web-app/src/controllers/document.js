const { fetchDocument } = require('../lib/documents-api-wrapper');
const logger = require('../lib/logger');

const getDocument = async (req, res) => {
  const { appealOrQuestionnaireId, documentId } = req.params;

  try {
    const { headers, body } = await fetchDocument(appealOrQuestionnaireId, documentId);

    res.set({
      'content-length': headers.get('content-length'),
      'content-disposition': `attachment;filename="${headers.get('x-original-file-name')}"`,
      'content-type': headers.get('content-type'),
    });

    return body.pipe(res);
  } catch (err) {
    logger.error({ err }, 'Failed to get document');
    return res.sendStatus(500);
  }
};

module.exports = {
  getDocument,
};
