const { createIndividual, deleteIndividual } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionIndividual(req, res) {
	const id = req.params.id;

	if (!id) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const content = await createIndividual(id, req.body);
	if (!content) {
		throw ApiError.unableToCreateIndividual();
	}
	res.status(200).send(content);
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionIndividual(req, res) {
	const { id, individualId } = req.params;

	if (!id) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	if (!individualId) {
		throw ApiError.badRequest({ errors: ['addressId is required'] });
	}

	const content = await deleteIndividual(id, individualId);
	if (!content) {
		throw ApiError.unableToDeleteIndividual();
	}
	res.status(200).send(content);
}

module.exports = {
	createSubmissionIndividual,
	deleteSubmissionIndividual
};
