/* eslint-env browser */

const cookieConfig = require('./cookie-config');

const showSingleDomElementBySelector = (document, selector) =>
  document.querySelector(selector).classList.remove(cookieConfig.CSS_CLASSES.displayNone);

const hideSingleDomElementBySelector = (document, selector) =>
  document.querySelector(selector).classList.add(cookieConfig.CSS_CLASSES.displayNone);

module.exports = {
  showSingleDomElementBySelector,
  hideSingleDomElementBySelector,
};
