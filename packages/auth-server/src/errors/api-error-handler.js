/**
 * @param {import('pino').Logger} logger
 */
function getApiErrorHandler(logger) {
	/**
	 * @type {import('express').ErrorRequestHandler}
	 */ // eslint-disable-next-line no-unused-vars
	return (err, req, res, next) => {
		logger.error(err);
		res.status(500).json('Unexpected internal server error while handling API call');
	};
}

export default getApiErrorHandler;
