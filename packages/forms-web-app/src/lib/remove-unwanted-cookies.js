const cookieConfig = require('./client-side/cookie/cookie-config');
const {
	extractRootDomainNameFromHostnameAndSubdomains
} = require('./extract-root-domain-name-from-full-domain-name');
const { CONSTS } = require('../consts');

const defaultKeepMeCookies = [
	CONSTS.SESSION_COOKIE_NAME,
	cookieConfig.COOKIE_POLICY_KEY,
	CONSTS.EASY_AUTH_COOKIE_NAME
];

/**
 * This is a brute force attempt at removing any unwanted cookies.
 *
 * Whilst intentionally generic, this is primarily aimed at removing Google Analytics cookies
 * after the visitor already accepted, but subsequently declined the 'usage' cookie policy.
 *
 * GA cookies are set against the root domain, and do not appear to be marked secure.
 *
 * @param req
 * @param res
 * @param keepTheseCookies
 */
const removeUnwantedCookies = (req, res, keepTheseCookies = defaultKeepMeCookies) => {
	const domain = extractRootDomainNameFromHostnameAndSubdomains(req.hostname, req.subdomains);

	Object.keys(req.cookies)
		.filter((cookieName) => keepTheseCookies.includes(cookieName) === false)
		.forEach((cookieName) => {
			res.clearCookie(cookieName);
			// in dev/test google analytics sets on root domain
			res.clearCookie(cookieName, { domain: `.${domain}`, secure: true });
			res.clearCookie(cookieName, { domain: `.${domain}`, secure: false });
			// in prod google analytics appears to set cookies on hostname with a preceding .
			res.clearCookie(cookieName, { domain: `.${req.hostname}`, secure: true });
			res.clearCookie(cookieName, { domain: `.${req.hostname}`, secure: false });
		});
};

module.exports = {
	defaultKeepMeCookies,
	removeUnwantedCookies
};
