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
const { storeAppealPageRedirect } = require('#lib/login-redirect');

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

	let requestedPageRedirect;

	if (req.originalUrl.startsWith('/rule-6/')) {
		requestedPageRedirect = req.originalUrl;
	}

	logger.info('Rule 6 user not logged in');
	req.session.regenerate((err) => {
		if (err) {
			req.session = {};
		}

		if (requestedPageRedirect) {
			storeAppealPageRedirect('rule-6', req);
		}

		return res.redirect(`/${EMAIL_ADDRESS}`);
	});
};

module.exports = requireUser;
