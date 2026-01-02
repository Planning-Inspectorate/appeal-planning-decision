const { createAppealGround, deleteAppealGround } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionAppealGround(req, res) {
	const id = req.params.id;

	if (!id) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const content = await createAppealGround(id, req.body);
	if (!content) {
		throw ApiError.unableToCreateAppealGroundl();
	}
	res.status(200).send(content);
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionAppealGround(req, res) {
	const { id, appealGroundId } = req.params;

	if (!id) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	if (!appealGroundId) {
		throw ApiError.badRequest({ errors: ['appealGroundId is required'] });
	}

	const content = await deleteAppealGround(id, appealGroundId);
	if (!content) {
		throw ApiError.unableToDeleteAppealGround();
	}
	res.status(200).send(content);
}

module.exports = {
	createSubmissionAppealGround,
	deleteSubmissionAppealGround
};
