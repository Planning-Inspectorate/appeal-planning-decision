const { createAddress, deleteAddress } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionAddress(req, res) {
	const id = req.params.id;

	if (!id) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const content = await createAddress(id, req.body);
	if (!content) {
		throw ApiError.unableToCreateAddress();
	}
	res.status(200).json(content);
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionAddress(req, res) {
	const { id, addressId } = req.params;

	if (!id) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	if (!addressId) {
		throw ApiError.badRequest({ errors: ['addressId is required'] });
	}

	const content = await deleteAddress(id, addressId);
	if (!content) {
		throw ApiError.unableToDeleteAddress();
	}
	res.status(200).json(content);
}

module.exports = {
	createSubmissionAddress,
	deleteSubmissionAddress
};
