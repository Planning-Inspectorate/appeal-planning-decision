/* eslint-env browser */

const initialiseGoogleAnalytics = (document) => {
  const gaScript = document.createElement('script');
  gaScript.type = 'text/javascript';
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`;

  const firstScriptElement = document.getElementsByTagName('script')[0];
  firstScriptElement.parentNode.insertBefore(gaScript, firstScriptElement);
};

module.exports = {
  initialiseGoogleAnalytics,
};
