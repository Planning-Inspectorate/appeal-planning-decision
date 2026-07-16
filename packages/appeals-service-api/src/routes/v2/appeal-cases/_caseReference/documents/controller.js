const { AppealDocumentRepository } = require('./repo');
const repo = new AppealDocumentRepository();

/**
 * @type {import('express').RequestHandler}
 */
async function getAppealDocuments(req, res) {
	const { documentTypes } = req.query;

	const documentTypesArray = documentTypes ? documentTypes.split(',') : [];
	const content = await repo.getDocumentsByAppealRef(req.params.caseReference, documentTypesArray);
	res.status(200).send(content);
}

module.exports = {
	getAppealDocuments
};
