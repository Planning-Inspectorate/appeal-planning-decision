/* eslint-env browser */

const { cookieConsentHandler } = require('./cookie/cookie-consent');
const { initialiseOptionalJavaScripts } = require('./javascript-requiring-consent');
const config = require('../../config');

cookieConsentHandler(document);
initialiseOptionalJavaScripts(document, config);
