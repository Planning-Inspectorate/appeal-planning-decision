Cypress.Commands.add(
  'provideAcceptNotNecessaryCookies',
  require('./provideAcceptNotNecessaryCookies'),
);

Cypress.Commands.add(
  'provideRejectNotNecessaryCookies',
  require('./provideRejectNotNecessaryCookies'),
);

Cypress.Commands.add(
  'confirmAcceptedCookieBannerVisible',
  require('./confirmAcceptedCookieBannerVisible'),
);

Cypress.Commands.add(
  'confirmRejectedCookieBannerVisible',
  require('./confirmRejectedCookieBannerVisible'),
);

Cypress.Commands.add(
  'confirmCookieConsentBannerIsVisible',
  require('./confirmCookieConsentBannerIsVisible'),
);

Cypress.Commands.add(
  'confirmCookieConsentBannerIsNotVisible',
  require('./confirmCookieConsentBannerIsNotVisible'),
);

Cypress.Commands.add(
  'confirmCookieConsentBannerDoesNotExist',
  require('./confirmCookieConsentBannerDoesNotExist'),
);

Cypress.Commands.add('confirmCookiePolicy', require('./confirmCookiePolicy'));

Cypress.Commands.add(
  'viewCookiePageUsingCookieConsentBannerLink',
  require('./viewCookiePageUsingCookieConsentBannerLink'),
);

Cypress.Commands.add(
  'confirmThirdPartyCookiesHaveBeenDeleted',
  require('./confirmThirdPartyCookiesHaveBeenDeleted'),
);

Cypress.Commands.add(
  'confirmUsageCookieRadioButtonIsMarkedAsInactive',
  require('./confirmUsageCookieRadioButtonIsMarkedAsInactive'),
);

Cypress.Commands.add(
  'confirmUsageCookiesHaveNoExistingState',
  require('./confirmUsageCookiesHaveNoExistingState'),
);

Cypress.Commands.add(
  'confirmUsageCookieHasBeenMarkedAsActive',
  require('./confirmUsageCookieHasBeenMarkedAsActive'),
);

Cypress.Commands.add(
  'confirmHasGoogleAnalyticsCookies',
  require('./confirmHasGoogleAnalyticsCookies'),
);

Cypress.Commands.add(
  'confirmCookieFlashMessageContent',
  require('./confirmCookieFlashMessageContent'),
);
