/* eslint-env browser */

const { cookieConsentHandler } = require('./cookie/cookie-consent');
const { initialiseOptionalJavaScripts } = require('./javascript-requiring-consent');
const { initialiseMultiFileUpload } = require('./components/multi-file-upload.js');

cookieConsentHandler(document);
initialiseOptionalJavaScripts(document);
initialiseMultiFileUpload(document);
