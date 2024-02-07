import logger from '../lib/logger.js';

/**
 * @type {import('express').ErrorRequestHandler}
 */
function apiErrorHandler(err, req, res) {
	logger.error(err);
	res.status(500).json('Unexpected internal server error while handling API call');
}

export default apiErrorHandler;
