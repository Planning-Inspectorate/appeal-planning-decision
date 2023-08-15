const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const logger = require('../../lib/logger');

const {
	VIEW: {
		LPA_DASHBOARD: { YOUR_EMAIL_ADDRESS }
	}
} = require('../../lib/views');

const requireUser = (req, res, next) => {
	let {
		session: { lpaUser }
	} = req;

	if (!lpaUser || lpaUser.enabled === STATUS_CONSTANTS.REMOVED) {
		logger.info('User not logged in');
		return res.redirect(`/${YOUR_EMAIL_ADDRESS}`);

	}

	return next();
};

module.exports = requireUser;
