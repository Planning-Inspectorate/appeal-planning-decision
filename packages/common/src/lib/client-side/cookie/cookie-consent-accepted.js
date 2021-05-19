/* eslint-env browser */

const cookieConfig = require('./cookie-config');
const {
  hideSingleDomElementBySelector,
  showSingleDomElementBySelector,
} = require('./cookie-dom-helpers');

const hideConsentAcceptedBanner = (document) =>
  hideSingleDomElementBySelector(document, cookieConfig.SELECTORS.cookieBanner.accepted);

const addCookieConsentAcceptedListener = (document) => {
  const acknowledgeCookieConsentAcceptedButton = document.querySelector(
    cookieConfig.SELECTORS.button.cookieBanner.accepted
  );

  const handler = () => {
    hideConsentAcceptedBanner(document);
    acknowledgeCookieConsentAcceptedButton.removeEventListener('click', handler);
  };

  acknowledgeCookieConsentAcceptedButton.addEventListener('click', handler, false);
};

const showCookieConsentAcceptedBanner = (document) => {
  showSingleDomElementBySelector(document, cookieConfig.SELECTORS.cookieBanner.accepted);
  addCookieConsentAcceptedListener(document);
};

module.exports = {
  addCookieConsentAcceptedListener,
  hideConsentAcceptedBanner,
  showCookieConsentAcceptedBanner,
};
