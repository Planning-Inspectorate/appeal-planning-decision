const logger = require('../../lib/logger');

const {
	VIEW: {
		ERROR_PAGES: { UNAUTHORIZED }
	}
} = require('../../lib/views');

const requireUser = (req, res, next) => {
	let {
		session: { lpaUser }
	} = req;

	if (!lpaUser || lpaUser.enabled !== true) {
		res.status(401);
		logger.info('User not logged in: 401');
		return res.render(UNAUTHORIZED);
	}

	return next();
};

module.exports = requireUser;
