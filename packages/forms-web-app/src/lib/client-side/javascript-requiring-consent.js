/* eslint-env browser */

const { readCookie } = require('./cookie/cookie-jar');
const cookieConfig = require('./cookie/cookie-config');
const { initialiseGoogleAnalytics } = require('./google-analytics');
const googleTagManager = require('./google-tag-manager');

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

    if (parsed.usage === false) {
      // eslint-disable-next-line no-console
      console.log('Declined consent. Third party cookies are not enabled.');

      if (process.env.googleTagManager && process.env.googleTagManagerId) {
        googleTagManager.denyConsent();
      }
      return;
    }

    if (process.env.googleTagManager && process.env.googleTagManagerId) {
      googleTagManager.grantConsent();
    } else {
      initialiseGoogleAnalytics(document);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Unable to decode the value of cookieg`, e);
  }
};

module.exports = {
  initialiseOptionalJavaScripts,
};
