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

Cypress.Commands.add(
  'provideLocalPlanningDepartment',
  require('./eligibility-local-planning-department/provideLocalPlanningDepartment'),
);
Cypress.Commands.add(
  'confirmLocalPlanningDepartmentIsRequired',
  require('./eligibility-local-planning-department/confirmLocalPlanningDepartmentIsRequired'),
);
Cypress.Commands.add(
  'confirmLocalPlanningDepartmentIsNotParticipating',
  require('./eligibility-local-planning-department/confirmLocalPlanningDepartmentIsNotParticipating'),
);
Cypress.Commands.add(
  'confirmRedirectToExternalService',
  require('./eligibility-local-planning-department/confirmRedirectToExternalService'),
);
Cypress.Commands.add(
  'confirmProviedLocalPlanningDepartmentWasAccepted',
  require('./eligibility-local-planning-department/confirmProviedLocalPlanningDepartmentWasAccepted'),
);

Cypress.Commands.add(
  'provideNoListedBuildingStatement',
  require('./eligibility-listed-building-status/provideNoListedBuildingStatement'),
);
Cypress.Commands.add(
  'confirmListedBuildingStatementIsRequired',
  require('./eligibility-listed-building-status/confirmListedBuildingStatementIsRequired')
);
Cypress.Commands.add(
  'stateCaseInvolvesListedBuilding',
  require('./eligibility-listed-building-status/stateCaseInvolvesListedBuilding')
);
Cypress.Commands.add(
  'confirmListedBuildingsCannotProceed',
  require('./eligibility-listed-building-status/confirmListedBuildingsCannotProceed')
);
Cypress.Commands.add(
  'stateCaseDoesNotInvolveAListedBuilding',
  require('./eligibility-listed-building-status/stateCaseDoesNotInvolveAListedBuilding'),
);
Cypress.Commands.add(
  'confirmUserCanProceedWithNonListedBuilding',
  require('./eligibility-listed-building-status/confirmUserCanProceedWithNonListedBuilding'),
);
