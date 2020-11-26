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
  require('./eligibility-listed-building-status/confirmListedBuildingStatementIsRequired'),
);

Cypress.Commands.add(
  'stateCaseInvolvesListedBuilding',
  require('./eligibility-listed-building-status/stateCaseInvolvesListedBuilding'),
);

Cypress.Commands.add(
  'confirmListedBuildingsCannotProceed',
  require('./eligibility-listed-building-status/confirmListedBuildingsCannotProceed'),
);

Cypress.Commands.add(
  'stateCaseDoesNotInvolveAListedBuilding',
  require('./eligibility-listed-building-status/stateCaseDoesNotInvolveAListedBuilding'),
);

Cypress.Commands.add(
  'confirmUserCanProceedWithNonListedBuilding',
  require('./eligibility-listed-building-status/confirmUserCanProceedWithNonListedBuilding'),
);

// Commands for appeal statement submission

Cypress.Commands.add(
  'checkNoSensitiveInformation',
  require('./appeal-statement-submission/checkNoSensitiveInformation'),
);

Cypress.Commands.add(
  'confirmAppealStatementFileIsNotUploaded',
  require('./appeal-statement-submission/confirmAppealStatementFileIsNotUploaded'),
);

Cypress.Commands.add(
  'confirmAppealStatementFileIsUploaded',
  require('./appeal-statement-submission/confirmAppealStatementFileIsUploaded'),
);

Cypress.Commands.add(
  'confirmFileContainsSensitiveInformation',
  require('./appeal-statement-submission/confirmFileContainsSensitiveInformation'),
);

Cypress.Commands.add(
  'confirmFileInvalidBecauseExceedsSizeLimit',
  require('./appeal-statement-submission/confirmFileInvalidBecauseExceedsSizeLimit'),
);

Cypress.Commands.add(
  'confirmFileInvalidBecauseWrongFileType',
  require('./appeal-statement-submission/confirmFileInvalidBecauseWrongFileType'),
);

Cypress.Commands.add(
  'goToAppealStatementSubmission',
  require('./appeal-statement-submission/goToAppealStatementSubmission'),
);

Cypress.Commands.add('saveAndContinue', require('./appeal-statement-submission/saveAndContinue'));

Cypress.Commands.add(
  'uncheckNoSensitiveInformation',
  require('./appeal-statement-submission/uncheckNoSensitiveInformation'),
);

Cypress.Commands.add(
  'uploadAppealStatementFile',
  require('./appeal-statement-submission/uploadAppealStatementFile'),
);

Cypress.Commands.add(
  'goToWhoAreYouPage',
  require('./appellant-submission-who-are-you/goToWhoAreYouPage'),
);

Cypress.Commands.add(
  'answerYesOriginalAppellant',
  require('./appellant-submission-who-are-you/answerYes'),
);
Cypress.Commands.add(
  'answerNoOriginalAppellant',
  require('./appellant-submission-who-are-you/answerNo'),
);

Cypress.Commands.add(
  'confirmOriginalAppellantAsked',
  require('./appellant-submission-who-are-you/confirmOriginalAppellantAsked'),
);

Cypress.Commands.add(
  'confirmOriginalAppellantNotAsked',
  require('./appellant-submission-who-are-you/confirmOriginalAppellantNotAsked'),
);

Cypress.Commands.add(
  'clickSaveAndContinue',
  require('./appellant-submission-who-are-you/clickSaveAndContinue'),
);

Cypress.Commands.add(
  'goToDetailsPage',
  require('./appellant-submission-your-details/goToDetailsPage'),
);
Cypress.Commands.add(
  'provideDetailsName',
  require('./appellant-submission-your-details/provideDetailsName'),
);
Cypress.Commands.add(
  'provideDetailsEmail',
  require('./appellant-submission-your-details/provideDetailsEmail'),
);
Cypress.Commands.add(
  'confirmDetailsWasAccepted',
  require('./appellant-submission-your-details/confirmDetailsWasAccepted'),
);
Cypress.Commands.add(
  'confirmDetailsWasRejected',
  require('./appellant-submission-your-details/confirmDetailsWasRejected'),
);

Cypress.Commands.add(
  'goToApplicantNamePage',
  require('./appellant-submission-applicant-name/goToApplicantNamePage'),
);
Cypress.Commands.add(
  'confirmApplicantNameWasAccepted',
  require('./appellant-submission-applicant-name/confirmApplicantNameWasAccepted'),
);
Cypress.Commands.add(
  'confirmApplicantNameWasRejected',
  require('./appellant-submission-applicant-name/confirmApplicantNameWasRejected'),
);
Cypress.Commands.add(
  'provideApplicantName',
  require('./appellant-submission-applicant-name/provideApplicantName'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationAccepted',
  require('./appellant-submission-upload-application/confirmPlanningApplicationAccepted'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationRejectedBecause',
  require('./appellant-submission-upload-application/confirmPlanningApplicationRejectedBecause'),
);

Cypress.Commands.add(
  'goToPlanningApplicationSubmission',
  require('./appellant-submission-upload-application/goToPlanningApplicationSubmission'),
);

Cypress.Commands.add(
  'uploadPlanningApplicationFile',
  require('./appellant-submission-upload-application/uploadPlanningApplicationFile'),
);

Cypress.Commands.add(
  'confirmUploadDecisionRejectedBecause',
  require('./appellant-submission-upload-decision/confirmUploadDecisionRejectedBecause'),
);

Cypress.Commands.add(
  'confirmUploadDecisionAccepted',
  require('./appellant-submission-upload-decision/confirmUploadDecisionAccepted'),
);

Cypress.Commands.add(
  'goToUploadDecisionSubmission',
  require('./appellant-submission-upload-decision/goToUploadDecisionSubmission'),
);

Cypress.Commands.add(
  'uploadUploadDecisionFile',
  require('./appellant-submission-upload-decision/uploadUploadDecisionFile'),
);
