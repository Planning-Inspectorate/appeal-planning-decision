Cypress.Commands.add(
  'confirmSubmissionInformationDisplayItems',
  require('./confirmSubmissionInformationDisplayItems'),
);

Cypress.Commands.add(
  'goToSubmissionInformationPage',
  require('../appeal-navigation/appellant-submission/goToSubmissionInformationPage'),
);
