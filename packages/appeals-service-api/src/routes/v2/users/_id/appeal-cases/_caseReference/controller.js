const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const service = require('./service');

/**
 * @type {import('express').Handler}
 */
exports.get = async (req, res) => {
	let statusCode = 200;
	let body = {};

	const { caseReference, id: userId } = req.params;
	const { role } = req.query;

	if (!caseReference || !userId || !role || typeof role !== 'string') {
		throw ApiError.badRequest();
	}

	try {
		body = await service.get({
			caseReference,
			userId,
			role
		});
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get users: ${error.code} // ${error.errors}`);
			statusCode = error.code;
			body = error.errors;
		} else {
			logger.error('Error:', error);
			statusCode = 500;
			body = 'An unexpected error occurred';
		}
	} finally {
		res.status(statusCode).send(body);
	}
};
