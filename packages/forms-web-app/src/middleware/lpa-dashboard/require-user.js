const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const { getUserFromSession } = require('../../services/user.service');
const logger = require('../../lib/logger');
const isIdle = require('../../lib/check-session-idle');

const {
	VIEW: {
		LPA_DASHBOARD: { YOUR_EMAIL_ADDRESS }
	}
} = require('../../lib/views');

const {
	server: { sessionIdleTimeoutLPA, sessionIdleTimeoutDelay }
} = require('../../config');

/**
 * @type {import('express').Handler}
 */
const requireUser = (req, res, next) => {
	const user = getUserFromSession(req);

	if (
		user &&
		user?.isLpaUser &&
		user?.lpaStatus !== STATUS_CONSTANTS.REMOVED &&
		user?.expiry.getTime() > Date.now() &&
		!isIdle(req, sessionIdleTimeoutLPA, sessionIdleTimeoutDelay)
	) {
		return next();
	}

	logger.info('LPA user not logged in');
	req.session.regenerate((err) => {
		if (err) {
			req.session = {};
		}

		req.session.loginRedirect = req.originalUrl;

		return res.redirect(`/${YOUR_EMAIL_ADDRESS}`);
	});
};

module.exports = requireUser;
