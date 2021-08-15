/* eslint-env browser */

function applyConsent(consent) {
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    // eslint-disable-next-line no-undef, prefer-rest-params
    dataLayer.push(arguments);
  }

  /* istanbul ignore else */
  if (consent === 'denied' || consent === 'granted') {
    gtag('consent', 'update', {
      analytics_storage: consent, // We only care about analytics_storage
    });
  }
}

const denyConsent = () => {
  applyConsent('denied');
};

const grantConsent = () => {
  applyConsent('granted');
};

module.exports = {
  grantConsent,
  denyConsent,
};
