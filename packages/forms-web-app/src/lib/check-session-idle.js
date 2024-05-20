const logger = require('../lib/logger');

/**
 * @param {import('express').Request} req
 * @param {number} idleTimeout - max time a user can be idle for before being logged out (in milliseconds)
 * @param {number} [delay] - delay between updating the last updated time (defaults to 5 minutes, in milliseconds)
 * @returns {boolean} true if the user has been idle beyond the expiry
 */
const isSessionIdle = (req, idleTimeout, delay = 5 * 60 * 1000) => {
	const currentTime = Date.now();

	// If lastAccessedTime not set yet, set it and return false
	if (!req.session.lastAccessedTime) {
		logger.debug('creating lastAccessedTime');
		req.session.lastAccessedTime = currentTime;
		return false;
	}

	// not idle
	if (currentTime < req.session.lastAccessedTime + idleTimeout) {
		// update lastAccessedTime if greater than delay
		if (currentTime > req.session.lastAccessedTime + delay) {
			req.session.lastAccessedTime = currentTime;
			logger.debug('updating lastAccessedTime');
		}

		logger.debug('not idle');
		return false;
	}

	// is idle
	logger.info('user session is idle');
	return true;
};

module.exports = isSessionIdle;
