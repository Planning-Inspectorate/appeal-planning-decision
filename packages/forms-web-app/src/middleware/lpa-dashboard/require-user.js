const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const { getUserFromSession } = require('../../services/user.service');
const { storeAppealPageRedirect } = require('../../lib/login-redirect');
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

	let requestedPageRedirect;

	if (req.originalUrl.startsWith('/manage-appeals/')) {
		requestedPageRedirect = req.originalUrl;
	}

	logger.info('LPA user not logged in');
	req.session.regenerate((err) => {
		if (err) {
			req.session = {};
		}

		if (requestedPageRedirect) {
			storeAppealPageRedirect('manage-appeals', req);
		}

		return res.redirect(`/${YOUR_EMAIL_ADDRESS}`);
	});
};

module.exports = requireUser;
