/* eslint-env browser */

const initialiseGoogleAnalytics = (document) => {
  const gaId = document.getElementById('gaId').textContent;

  const gaScript = document.createElement('script');
  gaScript.type = 'text/javascript';
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;

  const firstScriptElement = document.getElementsByTagName('script')[0];
  firstScriptElement.parentNode.insertBefore(gaScript, firstScriptElement);

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    // eslint-disable-next-line no-undef, prefer-rest-params
    dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('config', gaId);
};

module.exports = {
  initialiseGoogleAnalytics,
};
