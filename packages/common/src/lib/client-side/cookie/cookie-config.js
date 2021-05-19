const COOKIE_POLICY_KEY = 'cookie_policy';

const CSS_CLASSES = {
  displayNone: 'govuk-!-display-none',
};

const DEFAULT_COOKIE_POLICY = {
  essential: true,
  settings: false,
  usage: false,
  campaigns: false,
};

const SELECTORS = {
  button: {
    cookieBanner: {
      consent: 'button[name="cookie_banner"]',
      accepted: 'button[name="cookie_banner_accepted"]',
      rejected: 'button[name="cookie_banner_rejected"]',
    },
  },
  cookieBanner: {
    consent: '#cookie-banner-consent',
    accepted: '#cookie-banner-accepted',
    rejected: '#cookie-banner-rejected',
  },
};

module.exports = {
  COOKIE_POLICY_KEY,
  CSS_CLASSES,
  DEFAULT_COOKIE_POLICY,
  SELECTORS,
};
