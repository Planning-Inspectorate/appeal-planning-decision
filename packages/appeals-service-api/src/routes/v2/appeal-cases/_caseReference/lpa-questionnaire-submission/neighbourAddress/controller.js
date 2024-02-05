const { getNeighbourAddresses, createNeighbourAddress } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function getSubmissionNeighbourAddresses(req, res) {
	try {
		const { 'questionnaire-id': questionnaireId } = req.query;
		if (!questionnaireId || typeof questionnaireId !== 'string') {
			throw ApiError.withMessage(400, 'questionnaire id is required');
		}
		const content = await getNeighbourAddresses(req.body);
		if (!content) {
			throw ApiError.unableToGetNeighbourAddresses();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get neighbour addresses: ${error.code} // ${error.message.errors}`);
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
async function createSubmissionNeighbourAddress(req, res) {
	try {
		// const { 'lpa-code': lpaCode } = req.query;
		// if (!lpaCode || typeof lpaCode !== 'string') {
		// 	throw ApiError.withMessage(400, 'lpa-code is required');
		// }
		const content = await createNeighbourAddress(req.body);
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
	createSubmissionNeighbourAddress,
	getSubmissionNeighbourAddresses
};
