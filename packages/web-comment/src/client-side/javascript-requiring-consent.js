/* eslint-env browser */
/* istanbul ignore file */

const { readCookie } = require('./cookie/cookie-jar');
const cookieConfig = require('./cookie/cookie-config');
const { initialiseGoogleAnalytics } = require('./google-analytics');
const googleTagManager = require('./google-tag-manager');

function initialiseTagManager(consent) {
	if (!window.wfeconfig.googleTagManagerId) {
		return;
	}

	if (consent === true) {
		// eslint-disable-next-line no-console
		console.log('Consent granted. Third party cookies are enabled.');
		googleTagManager.grantConsent();
		return;
	}

	// eslint-disable-next-line no-console
	console.log('Declined consent. Third party cookies are not enabled.');
	googleTagManager.denyConsent();
}

const initialiseOptionalJavaScripts = (document) => {
	const cookie = readCookie(document, cookieConfig.COOKIE_POLICY_KEY);

	if (cookie === null) {
		// eslint-disable-next-line no-console
		console.log('Consent not yet given for optional JavaScripts.');
		return;
	}

	try {
		const parsed = JSON.parse(cookie);

		if (!parsed || typeof parsed.usage === 'undefined') {
			return;
		}

		// using tag manager
		if (window.wfeconfig.googleTagManager) {
			initialiseTagManager(parsed.usage);
			return;
		}

		// not using tag manager
		if (parsed.usage === true) {
			initialiseGoogleAnalytics(document);
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('Unable to decode the value of cookie', e);
	}
};

module.exports = {
	initialiseOptionalJavaScripts
};
