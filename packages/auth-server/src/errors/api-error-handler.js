import logger from '../lib/logger.js';

/**
 * @type {import('express').ErrorRequestHandler}
 */ // eslint-disable-next-line no-unused-vars
function apiErrorHandler(err, req, res, next) {
	logger.error(err);
	res.status(500).json('Unexpected internal server error while handling API call');
}

export default apiErrorHandler;
