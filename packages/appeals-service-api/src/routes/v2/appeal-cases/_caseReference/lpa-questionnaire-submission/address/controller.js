const { createAddress, deleteAddress } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionAddress(req, res) {
	const caseReference = req.params.caseReference;
	const content = await createAddress(caseReference, req.body);
	if (!content) {
		throw ApiError.unableToCreateAddress();
	}
	res.status(200).json(content);
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionAddress(req, res) {
	const { caseReference, addressId } = req.params;
	const content = await deleteAddress(caseReference, addressId);
	if (!content) {
		throw ApiError.unableToDeleteAddress();
	}
	res.status(200).json(content);
}

module.exports = {
	createSubmissionAddress,
	deleteSubmissionAddress
};
