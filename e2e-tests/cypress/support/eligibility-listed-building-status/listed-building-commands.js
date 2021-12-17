Cypress.Commands.add(
  'provideNoListedBuildingStatement',
  require('../eligibility-listed-building-status/provideNoListedBuildingStatement'),
);

Cypress.Commands.add(
  'confirmListedBuildingStatementIsRequired',
  require('../eligibility-listed-building-status/confirmListedBuildingStatementIsRequired'),
);

Cypress.Commands.add(
  'stateCaseInvolvesListedBuilding',
  require('../eligibility-listed-building-status/stateCaseInvolvesListedBuilding'),
);

Cypress.Commands.add(
  'confirmListedBuildingsCannotProceed',
  require('../eligibility-listed-building-status/confirmListedBuildingsCannotProceed'),
);

Cypress.Commands.add(
  'stateCaseDoesNotInvolveAListedBuilding',
  require('../eligibility-listed-building-status/stateCaseDoesNotInvolveAListedBuilding'),
);

Cypress.Commands.add(
  'confirmUserCanProceedWithNonListedBuilding',
  require('../eligibility-listed-building-status/confirmUserCanProceedWithNonListedBuilding'),
);

Cypress.Commands.add(
  'confirmProvidedAnswerIsDisplayed',
  require('../eligibility-listed-building-status/confirmProvidedAnswerIsDisplayed'),
);

Cypress.Commands.add(
  'browseBackToTheListedBuildingPage',
  require('../eligibility-listed-building-status/browseBackToTheListedBuildingPage'),
);
