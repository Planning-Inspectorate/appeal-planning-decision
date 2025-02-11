const { createLinkedAppeal, deleteLinkedAppeal } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionLinkedCase(req, res) {
	const caseReference = req.params.caseReference;
	const content = await createLinkedAppeal(caseReference, req.body);
	if (!content) {
		throw ApiError.unableToCreateLinkedCase();
	}
	res.status(200).json(content);
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionLinkedCase(req, res) {
	const { caseReference, linkedCaseId } = req.params;
	const content = await deleteLinkedAppeal(caseReference, linkedCaseId);
	if (!content) {
		throw ApiError.unableToDeleteLinkedCase();
	}
	res.status(200).json(content);
}

module.exports = {
	createSubmissionLinkedCase,
	deleteSubmissionLinkedCase
};
