Cypress.Commands.add(
  'provideAcceptNotNecessaryCookies',
  require('../cookies/provideAcceptNotNecessaryCookies'),
);

Cypress.Commands.add(
  'provideRejectNotNecessaryCookies',
  require('../cookies/provideRejectNotNecessaryCookies'),
);

Cypress.Commands.add(
  'confirmAcceptedCookieBannerVisible',
  require('../cookies/confirmAcceptedCookieBannerVisible'),
);

Cypress.Commands.add(
  'confirmRejectedCookieBannerVisible',
  require('../cookies/confirmRejectedCookieBannerVisible'),
);

Cypress.Commands.add(
  'confirmNoDecisionCookieBannerVisible',
  require('../cookies/confirmNoDecisionCookieBannerVisible'),
);

Cypress.Commands.add('confirmCookiePolicy', require('../cookies/confirmCookiePolicy'));

Cypress.Commands.add(
  'viewCookiePageUsingCookieConsentBannerLink',
  require('../cookies/viewCookiePageUsingCookieConsentBannerLink'),
);
