Cypress.Commands.add(
  'provideDecisionDate',
  require('./eligibility-decision-date/provideDecisionDate'),
);
Cypress.Commands.add(
  'confirmProvidedDecisionDateWasAccepted',
  require('./eligibility-decision-date/confirmProvidedDecisionDateWasAccepted'),
);
Cypress.Commands.add(
  'confirmProvidedDecisionDateWasRejected',
  require('./eligibility-decision-date/confirmProvidedDecisionDateWasRejected'),
);

Cypress.Commands.add(
  'confirmProvidedDecisionDateWasInvalid',
  require('./eligibility-decision-date/confirmProvidedDecisionDateWasInvalid'),
);

Cypress.Commands.add(
  'goToAppealSubmissionPage',
  require('./appellant-submission-appeal-statement/goToAppealSubmissionPage'),
);

Cypress.Commands.add('uploadFile', require('./appellant-submission-appeal-statement/uploadFile'));

Cypress.Commands.add(
  'checkNoSensitiveInformationIncludedInAppealStatement',
  require('./appellant-submission-appeal-statement/checkNoSensitiveInformationIncludedInAppealStatement'),
);

Cypress.Commands.add(
  'confirmUploadWasAccepted',
  require('./appellant-submission-appeal-statement/confirmUploadWasAccepted'),
);
Cypress.Commands.add(
  'confirmUploadWasRejected',
  require('./appellant-submission-appeal-statement/confirmUploadWasRejected'),
);
