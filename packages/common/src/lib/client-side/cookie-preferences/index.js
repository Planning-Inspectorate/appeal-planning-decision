/* eslint-env browser */

const initialiseCookiePreferencePage = (document) => {
  document
    .querySelectorAll('.cookie-settings__no-js')
    .forEach((element) => element.classList.add('govuk-!-display-none'));

  document
    .querySelectorAll('.cookie-settings__with-js')
    .forEach((element) => element.classList.remove('govuk-!-display-none'));
};

module.exports = {
  initialiseCookiePreferencePage,
};
