const { readCookie } = require('./cookie-jar');
const cookieConfig = require('./cookie-config');
const { cookieConsentHandler } = require('./cookie-consent');

const noOp = () => {};

const initialiseCookieConsent = (document) => {
  const cookie = readCookie(document, cookieConfig.COOKIE_POLICY_KEY);

  if (cookie === null) {
    return cookieConsentHandler(document);
  }

  return noOp();
};

module.exports = {
  initialiseCookieConsent,
};
