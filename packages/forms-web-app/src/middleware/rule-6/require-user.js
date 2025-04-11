const { getUserFromSession } = require('../../services/user.service');
const logger = require('../../lib/logger');
const isIdle = require('../../lib/check-session-idle');

const {
	VIEW: {
		RULE_6: { EMAIL_ADDRESS }
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
		user?.isRule6User &&
		user?.expiry.getTime() > Date.now() &&
		!isIdle(req, sessionIdleTimeoutLPA, sessionIdleTimeoutDelay)
	) {
		return next();
	}

	logger.info('Rule 6 user not logged in');
	req.session.regenerate((err) => {
		if (err) {
			req.session = {};
		}

		req.session.loginRedirect = req.originalUrl;

		return res.redirect(`/${EMAIL_ADDRESS}`);
	});
};

module.exports = requireUser;
