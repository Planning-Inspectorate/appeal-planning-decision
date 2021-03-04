
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
