const ApiError = require('./apiError');
const logger = require('../lib/logger.js');

/**
 * Error handler for OpenAPI Validation errors - maps to an ApiError
 *
 * @type {import('express').ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
function apiErrorHandler(err, req, res, next) {
	if (err instanceof ApiError) {
		const errorMessage = {
			code: err.code,
			errors: err.message.errors
		};
		res.status(err.code).json(errorMessage);
		return;
	}

	logger.error(err);
	res.status(500).json('Unexpected internal server error while handling API call');
}

module.exports = apiErrorHandler;
