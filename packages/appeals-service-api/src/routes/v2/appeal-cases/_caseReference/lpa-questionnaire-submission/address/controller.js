const { createAddress, deleteAddress } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionAddress(req, res) {
	try {
		const caseReference = req.params.caseReference;
		const content = await createAddress(caseReference, req.body);
		if (!content) {
			throw ApiError.unableToCreateAddress();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create submission address: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionAddress(req, res) {
	try {
		const { caseReference, addressId } = req.params;
		const content = await deleteAddress(caseReference, addressId);
		if (!content) {
			throw ApiError.unableToDeleteAddress();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to delete submission address: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	createSubmissionAddress,
	deleteSubmissionAddress
};
