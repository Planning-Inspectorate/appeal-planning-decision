const { fetchDocument } = require('../lib/documents-api-wrapper');
const logger = require('../lib/logger');

const getDocument = async (req, res) => {
	// Todo - ideally we should be taking the appeal id from the user session for appelants
	// Todo - for LPA officers we should take appeal id and the document id from the params, but also validate that the user is an LPA user and that the appeal belongs to their LPA
	const { appealOrQuestionnaireId, documentId } = req.params;

	try {
		const { headers, body } = await fetchDocument(appealOrQuestionnaireId, documentId);

		res.set({
			'content-length': headers.get('content-length'),
			'content-disposition': `attachment;filename="${headers.get('x-original-file-name')}"`,
			'content-type': headers.get('content-type')
		});

		return body.pipe(res);
	} catch (err) {
		logger.error({ err }, 'Failed to get document');
		return res.sendStatus(500);
	}
};

module.exports = {
	getDocument
};
