const { createNeighbourAddress } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionNeighbourAddress(req, res) {
	try {
		const caseReference = req.params.caseReference;
		const content = await createNeighbourAddress(caseReference, req.body);
		if (!content) {
			throw ApiError.unableToCreateNeighbourAddress();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create document upload: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	createSubmissionNeighbourAddress
};
