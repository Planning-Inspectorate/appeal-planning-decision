const { removeUnwantedCookies } = require('../lib/remove-unwanted-cookies');
const cookieConfig = require('../lib/client-side/cookie/cookie-config');
const { CONSTS } = require('../consts');

/**
 * Middleware to ensure any unwanted third party cookies are removed if the user has chosen not
 * to accept the usage policy.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (req, res, next) => {
	if (!req.cookies) {
		return next();
	}

	if (typeof req.cookies[cookieConfig.COOKIE_POLICY_KEY] === 'undefined') {
		removeUnwantedCookies(req, res);
		return next();
	}

	let activeCookiePolicy;
	try {
		activeCookiePolicy = JSON.parse(req.cookies[cookieConfig.COOKIE_POLICY_KEY]);
	} catch (e) {
		// something went wrong decoding the cookie policy JSON, so lets wipe it and start again
		removeUnwantedCookies(req, res, [CONSTS.SESSION_COOKIE_NAME, CONSTS.EASY_AUTH_COOKIE_NAME]);
		req.log.warn(e, 'Erasing all cookies due to JSON decoding error in the stored cookie policy.');
		return next();
	}

	if (activeCookiePolicy.usage) {
		return next();
	}

	removeUnwantedCookies(req, res);
	return next();
};
