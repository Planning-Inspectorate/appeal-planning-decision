/* eslint-env browser */

const cookieConfig = require('./cookie-config');
const {
  hideSingleDomElementBySelector,
  showSingleDomElementBySelector,
} = require('./cookie-dom-helpers');

const hideConsentRejectedBanner = (document) =>
  hideSingleDomElementBySelector(document, cookieConfig.SELECTORS.cookieBanner.rejected);

const addCookieConsentRejectedListener = (document) => {
  const acknowledgeCookieConsentRejectedButton = document.querySelector(
    cookieConfig.SELECTORS.button.cookieBanner.rejected
  );

  const handler = () => {
    hideConsentRejectedBanner(document);
    acknowledgeCookieConsentRejectedButton.removeEventListener('click', handler);
  };

  acknowledgeCookieConsentRejectedButton.addEventListener('click', handler, false);
};

const showCookieConsentRejectedBanner = (document) => {
  showSingleDomElementBySelector(document, cookieConfig.SELECTORS.cookieBanner.rejected);
  addCookieConsentRejectedListener(document);
};

module.exports = {
  addCookieConsentRejectedListener,
  hideConsentRejectedBanner,
  showCookieConsentRejectedBanner,
};
