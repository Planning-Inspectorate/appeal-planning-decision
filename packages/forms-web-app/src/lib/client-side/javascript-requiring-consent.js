/* eslint-env browser */

const { readCookie } = require('./cookie/cookie-jar');
const cookieConfig = require('./cookie/cookie-config');
const config = require('../../config');

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

      if (config.featureFlag.googleTagManager && config.server.googleTagManagerId) {
        console.log('test');
      }
      return;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Unable to decode the value of cookie: ${cookieConfig.COOKIE_POLICY_KEY}`, e);
  }
};

module.exports = {
  initialiseOptionalJavaScripts,
};
