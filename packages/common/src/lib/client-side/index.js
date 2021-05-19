/* eslint-env browser */

const { cookieConsentHandler } = require('./cookie/cookie-consent');
const { initialiseOptionalJavaScripts } = require('./javascript-requiring-consent');

cookieConsentHandler(document);
initialiseOptionalJavaScripts(document);
