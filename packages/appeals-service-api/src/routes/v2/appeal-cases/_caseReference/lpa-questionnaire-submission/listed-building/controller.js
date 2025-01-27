const { createListedBuilding, deleteListedBuilding } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createQuestionnaireListedBuilding(req, res) {
	const caseReference = req.params.caseReference;
	const content = await createListedBuilding(caseReference, req.body);
	if (!content) {
		throw ApiError.unableToCreateListedBuilding();
	}
	res.status(200).json(content);
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteQuestionnaireListedBuilding(req, res) {
	const { caseReference, listedId } = req.params;
	const content = await deleteListedBuilding(caseReference, listedId);
	if (!content) {
		throw ApiError.unableToDeleteListedBuilding();
	}
	res.status(200).json(content);
}

module.exports = {
	createQuestionnaireListedBuilding,
	deleteQuestionnaireListedBuilding
};
