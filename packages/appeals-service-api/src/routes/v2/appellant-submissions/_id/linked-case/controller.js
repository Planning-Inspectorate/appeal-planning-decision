const { createLinkedAppeal, deleteLinkedAppeal } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionLinkedCase(req, res) {
	const appellantSubmissionId = req.params.id;

	const content = await createLinkedAppeal(appellantSubmissionId, req.body);
	if (!content) {
		throw ApiError.unableToCreateLinkedCase();
	}
	res.status(200).json(content);
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionLinkedCase(req, res) {
	const { id, linkedCaseId } = req.params;
	const content = await deleteLinkedAppeal(id, linkedCaseId);
	if (!content) {
		throw ApiError.unableToDeleteLinkedCase();
	}
	res.status(200).json(content);
}

module.exports = {
	createSubmissionLinkedCase,
	deleteSubmissionLinkedCase
};
