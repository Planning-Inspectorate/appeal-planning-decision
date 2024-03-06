const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const logger = require('../../lib/logger');

const {
	VIEW: {
		LPA_DASHBOARD: { YOUR_EMAIL_ADDRESS }
	}
} = require('../../lib/views');

/**
 * @type {import('express').Handler}
 */
const requireUser = (req, res, next) => {
	const lpaUser = getLPAUserFromSession(req);

	if (!lpaUser || lpaUser.lpaStatus === STATUS_CONSTANTS.REMOVED) {
		logger.info('User not logged in');
		return res.redirect(`/${YOUR_EMAIL_ADDRESS}`);
	}

	return next();
};

module.exports = requireUser;
