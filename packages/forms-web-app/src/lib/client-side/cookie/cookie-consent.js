/* eslint-env browser */

const cookieConfig = require('./cookie-config');
const { createCookie, eraseCookie, readCookie } = require('./cookie-jar');
const { hideSingleDomElementBySelector } = require('./cookie-dom-helpers');
const { showCookieConsentAcceptedBanner } = require('./cookie-consent-accepted');
const { showCookieConsentRejectedBanner } = require('./cookie-consent-rejected');
const { initialiseOptionalJavaScripts } = require('../javascript-requiring-consent');

const setCookies = (document, cookiePolicy) => {
  eraseCookie(document, cookieConfig.COOKIE_POLICY_KEY);
  createCookie(document, cookieConfig.COOKIE_POLICY_KEY, JSON.stringify(cookiePolicy));
};

const hideConsentBanner = (document) =>
  hideSingleDomElementBySelector(document, cookieConfig.SELECTORS.cookieBanner.consent);

const getConsentButtons = (document) => {
  const selector = cookieConfig.SELECTORS.button.cookieBanner.consent;

  const allConsentButtons = document.querySelectorAll(selector);
  const acceptCookieConsentButton = document.querySelector(`${selector}[value="accept"]`);
  const rejectCookieConsentButton = document.querySelector(`${selector}[value="reject"]`);

  return {
    allConsentButtons,
    acceptCookieConsentButton,
    rejectCookieConsentButton,
  };
};

const displayConsentButtons = (consentButtons) =>
  consentButtons.forEach((button) => button.classList.remove(cookieConfig.CSS_CLASSES.displayNone));

const addAcceptCookieConsentListener = (document, acceptCookieConsentButton) => {
  const handler = () => {
    setCookies(document, {
      ...cookieConfig.DEFAULT_COOKIE_POLICY,
      usage: true,
    });
    hideConsentBanner(document);
    acceptCookieConsentButton.removeEventListener('click', handler);
    showCookieConsentAcceptedBanner(document);
    initialiseOptionalJavaScripts(document);
  };

  acceptCookieConsentButton.addEventListener('click', handler, false);
};

const addRejectCookieConsentListener = (document, rejectCookieConsentButton) => {
  const handler = () => {
    setCookies(document, cookieConfig.DEFAULT_COOKIE_POLICY);
    hideConsentBanner(document);
    rejectCookieConsentButton.removeEventListener('click', handler);
    showCookieConsentRejectedBanner(document);
  };

  rejectCookieConsentButton.addEventListener('click', handler, false);
};

const cookieConsentHandler = (document) => {
  const {
    allConsentButtons,
    acceptCookieConsentButton,
    rejectCookieConsentButton,
  } = getConsentButtons(document);

  if (!acceptCookieConsentButton || !rejectCookieConsentButton) {
    return;
  }

  if (readCookie(document, cookieConfig.COOKIE_POLICY_KEY) !== null) {
    hideConsentBanner(document);
    return;
  }

  addAcceptCookieConsentListener(document, acceptCookieConsentButton);
  addRejectCookieConsentListener(document, rejectCookieConsentButton);

  displayConsentButtons(allConsentButtons);
};

module.exports = {
  addRejectCookieConsentListener,
  addAcceptCookieConsentListener,
  cookieConsentHandler,
  displayConsentButtons,
  getConsentButtons,
  hideConsentBanner,
  setCookies,
};
