const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const service = require('./service');

/**
 * @type {import('express').Handler}
 */
exports.get = async (req, res) => {
	let statusCode = 200;
	let body = {};

	const { userId, isLpa = false, id_token, auth: { token: access_token } = {} } = req;
	const { caseReference } = req.params;
	const { role } = req.query;
	const appealUserRoles = req.appealUserRoles || [];

	if (!caseReference || !userId || !role || typeof role !== 'string') {
		throw ApiError.badRequest();
	}

	try {
		body = await service.get({
			caseReference,
			userId,
			isLpa,
			appealUserRoles,
			access_token,
			id_token
		});
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get users: ${error.code} // ${error.message.errors}`);
			statusCode = error.code;
			body = error.message.errors;
		} else {
			logger.error('Error:', error);
			statusCode = 500;
			body = 'An unexpected error occurred';
		}
	} finally {
		res.status(statusCode).send(body);
	}
};
