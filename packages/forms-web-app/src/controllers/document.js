const { fetchDocument } = require('../lib/documents-api-wrapper');
const logger = require('../lib/logger');

const getDocument = async (req, res) => {
	const { appealOrQuestionnaireId, documentId } = req.params;

	try {
		if (req.session.lpaUser) {
			const { headers, body } = await fetchDocument(appealOrQuestionnaireId, documentId);
			const sessionLpaCode = req.session.lpaUser.lpaCode;
			const associatedLpaCode = headers.get('x-original-file-name').match(/[A-z][0-9]{4}/gm)[0];

			if (sessionLpaCode != associatedLpaCode) {
				logger.error('Failed to get document');
				return res.sendStatus(401);
			}

			return await returnResult(headers, body, res);
		} else {
			const sessionAppealId = req.session.appeal.id;
			const { headers, body } = await fetchDocument(sessionAppealId, documentId);

			return await returnResult(headers, body, res);
		}
	} catch (err) {
		logger.error({ err }, 'Failed to get document');
		return res.sendStatus(500);
	}
};

const returnResult = async (headers, body, res) => {
	res.set({
		'content-length': headers.get('content-length'),
		'content-disposition': `attachment;filename="${headers.get('x-original-file-name')}"`,
		'content-type': headers.get('content-type')
	});

	return body.pipe(res);
};

module.exports = {
	getDocument
};
