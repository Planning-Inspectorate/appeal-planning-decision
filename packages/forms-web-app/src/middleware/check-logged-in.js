const { getUserFromSession } = require('../services/user.service');

const {
	server: { sessionIdleTimeoutAppellant, sessionIdleTimeoutDelay }
} = require('../config');
const isIdle = require('../lib/check-session-idle');

/**
 * @type {import('express').RequestHandler}
 */
const checkLoggedIn = async (req, res, next) => {
	const user = getUserFromSession(req);

	if (
		user &&
		user?.expiry.getTime() > Date.now() &&
		!isIdle(req, sessionIdleTimeoutAppellant, sessionIdleTimeoutDelay)
	) {
		return next();
	}

	let loginPage = '/appeal/email-address'; // appellant
	if (req.originalUrl.startsWith('/rule-6/'))
		loginPage = '/rule-6/email-address'; // rule6
	else if (req.originalUrl.startsWith('/lpa-questionnaire-document/')) {
		loginPage = '/manage-appeals/your-email-address';
	}

	req.session.regenerate((err) => {
		if (err) {
			req.session = {};
		}

		req.session.loginRedirect = req.originalUrl;

		return res.redirect(loginPage);
	});
};

module.exports = checkLoggedIn;
