const { getAppealsForUser } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getUserAppeals(req, res) {
	try {
		const content = await getAppealsForUser(req.params.id);
		if (!content) {
			throw ApiError.userNotFound();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	getUserAppeals
};
