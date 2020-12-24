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

Cypress.Commands.add(
  'checkNoSensitiveInformation',
  require('./appeal-statement-submission/checkNoSensitiveInformation'),
);

Cypress.Commands.add(
  'confirmThatNoErrorTriggered',
  require('./appeal-statement-submission/confirmThatNoErrorTriggered'),
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
  'confirmSiteAddressWasAccepted',
  require('./appeal-submission-appeal-site-address/confirmSiteAddressWasAccepted'),
);

Cypress.Commands.add(
  'confirmSiteAddressValue',
  require('./appeal-submission-appeal-site-address/confirmSiteAddressValue'),
);

Cypress.Commands.add(
  'confirmSiteAddressWasRejectedBecause',
  require('./appeal-submission-appeal-site-address/confirmSiteAddressWasRejectedBecause'),
);

Cypress.Commands.add(
  'goToSiteAddressPage',
  require('./appeal-submission-appeal-site-address/goToSiteAddressPage'),
);

Cypress.Commands.add(
  'provideAddressLine1',
  require('./appeal-submission-appeal-site-address/provideAddressLine1'),
);

Cypress.Commands.add(
  'provideAddressLine2',
  require('./appeal-submission-appeal-site-address/provideAddressLine2'),
);

Cypress.Commands.add(
  'confirmSiteAddressWasAccepted',
  require('./appeal-submission-appeal-site-address/confirmSiteAddressWasAccepted'),
);

Cypress.Commands.add(
  'provideCounty',
  require('./appeal-submission-appeal-site-address/provideCounty'),
);

Cypress.Commands.add(
  'providePostcode',
  require('./appeal-submission-appeal-site-address/providePostcode'),
);

Cypress.Commands.add(
  'provideTownOrCity',
  require('./appeal-submission-appeal-site-address/provideTownOrCity'),
);

Cypress.Commands.add(
  'goToAccessSitePage',
  require('./appeal-submission-access-to-appeal-site/goToAccessSitePage'),
);

Cypress.Commands.add(
  'answerCannotSeeTheWholeAppeal',
  require('./appeal-submission-access-to-appeal-site/answerCannotSeeTheWholeAppeal'),
);

Cypress.Commands.add(
  'answerCanSeeTheWholeAppeal',
  require('./appeal-submission-access-to-appeal-site/answerCanSeeTheWholeAppeal'),
);

Cypress.Commands.add(
  'confirmAccessSiteWasRejectedBecause',
  require('./appeal-submission-access-to-appeal-site/confirmAccessSiteWasRejectedBecause'),
);

Cypress.Commands.add(
  'confirmAccessSiteAnswered',
  require('./appeal-submission-access-to-appeal-site/confirmAccessSiteAnswered'),
);

Cypress.Commands.add(
  'confirmAccessSiteNotSubmitted',
  require('./appeal-submission-access-to-appeal-site/confirmAccessSiteNotSubmitted'),
);

Cypress.Commands.add(
  'provideMoreDetails',
  require('./appeal-submission-access-to-appeal-site/provideMoreDetails'),
);

Cypress.Commands.add(
  'answerDidNotToldOtherOwnersAppeal',
  require('./appeal-submission-appeal-site-ownership/answerDidNotToldOtherOwnersAppeal'),
);

Cypress.Commands.add(
  'answerDidToldOtherOwnersAppeal',
  require('./appeal-submission-appeal-site-ownership/answerDidToldOtherOwnersAppeal'),
);

Cypress.Commands.add(
  'answerDoesNotOwnTheWholeAppeal',
  require('./appeal-submission-appeal-site-ownership/answerDoesNotOwnTheWholeAppeal'),
);

Cypress.Commands.add(
  'answerOwnsTheWholeAppeal',
  require('./appeal-submission-appeal-site-ownership/answerOwnsTheWholeAppeal'),
);

Cypress.Commands.add(
  'confirmSiteOwnershipRejectedBecause',
  require('./appeal-submission-appeal-site-ownership/confirmSiteOwnershipRejectedBecause'),
);

Cypress.Commands.add(
  'confirmOtherOwnersAsked',
  require('./appeal-submission-appeal-site-ownership/confirmOtherOwnersAsked'),
);

Cypress.Commands.add(
  'confirmOtherSiteOwnerToldAnswered',
  require('./appeal-submission-appeal-site-ownership/confirmOtherSiteOwnerToldAnswered'),
);

Cypress.Commands.add(
  'confirmSiteOwnershipAccepted',
  require('./appeal-submission-appeal-site-ownership/confirmSiteOwnershipAccepted'),
);

Cypress.Commands.add(
  'confirmWholeSiteOwnerAnswered',
  require('./appeal-submission-appeal-site-ownership/confirmWholeSiteOwnerAnswered'),
);

Cypress.Commands.add(
  'goToOtherSiteOwnerToldPage',
  require('./appeal-submission-appeal-site-ownership/goToOtherSiteOwnerToldPage'),
);

Cypress.Commands.add(
  'goToWholeSiteOwnerPage',
  require('./appeal-submission-appeal-site-ownership/goToWholeSiteOwnerPage'),
);

Cypress.Commands.add('goToTaskListPage', require('./appeal-submission-tasklist/goToTaskListPage'));

Cypress.Commands.add(
  'checkStatusForTask',
  require('./appeal-submission-tasklist/checkStatusForTask'),
);

Cypress.Commands.add(
  'selectToUploadAppealSubmissionDocument',
  require('./appeal-submission-tasklist/selectToUploadAppealSubmissionDocument'),
);

Cypress.Commands.add(
  'confirmUserPresentedWithUploadAppealSubmissionDocument',
  require('./appeal-submission-tasklist/confirmUserPresentedWithUploadAppealSubmissionDocument'),
);

Cypress.Commands.add(
  'answerYesOriginalAppellant',
  require('./appellant-submission-your-details/provideAnswerYes'),
);
Cypress.Commands.add(
  'answerNoOriginalAppellant',
  require('./appellant-submission-your-details/provideAnswerNo'),
);

Cypress.Commands.add(
  'confirmAnswered',
  require('./appellant-submission-your-details/confirmAnswered'),
);

Cypress.Commands.add(
  'confirmAreYouOriginalApplicant',
  require('./appellant-submission-your-details/confirmAreYouOriginalApplicant'),
);

Cypress.Commands.add(
  'confirmOriginalAppellantAsked',
  require('./appellant-submission-your-details/confirmOriginalAppellantAsked'),
);

Cypress.Commands.add(
  'confirmOriginalAppellantNotAsked',
  require('./appellant-submission-your-details/confirmOriginalAppellantNotAsked'),
);

Cypress.Commands.add(
  'confirmWhoAreYouRejectedBecause',
  require('./appellant-submission-your-details/confirmWhoAreYouRejectedBecause'),
);

Cypress.Commands.add(
  'clickSaveAndContinue',
  require('./appellant-submission-your-details/clickSaveAndContinue'),
);

Cypress.Commands.add(
  'goToYourDetailsPage',
  require('./appellant-submission-your-details/goToYourDetailsPage'),
);

Cypress.Commands.add(
  'confirmNavigationYourDetailsPage',
  require('./appellant-submission-your-details/confirmNavigationYourDetailsPage'),
);

Cypress.Commands.add(
  'goToWhoAreYouPage',
  require('./appellant-submission-your-details/goToWhoAreYouPage'),
);

Cypress.Commands.add(
  'confirmNavigationWhoAreYouPage',
  require('./appellant-submission-your-details/confirmNavigationWhoAreYouPage'),
);

Cypress.Commands.add(
  'goToApplicantNamePage',
  require('./appellant-submission-your-details/goToApplicantNamePage'),
);

Cypress.Commands.add(
  'confirmNavigationApplicantNamePage',
  require('./appellant-submission-your-details/confirmNavigationApplicantNamePage'),
);

Cypress.Commands.add(
  'goToTaskListPage',
  require('./appellant-submission-your-details/goToTaskListPage'),
);

Cypress.Commands.add(
  'confirmNavigationTaskListPage',
  require('./appellant-submission-your-details/confirmNavigationTaskListPage'),
);

Cypress.Commands.add(
  'provideAreYouOriginalApplicant',
  require('./appellant-submission-your-details/provideAreYouOriginalApplicant'),
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
  'provideNameOfOriginalApplicant',
  require('./appellant-submission-your-details/provideNameOfOriginalApplicant'),
);

Cypress.Commands.add(
  'confirmOriginalApplicantWasRejected',
  require('./appellant-submission-your-details/confirmOriginalApplicantWasRejected'),
);

Cypress.Commands.add(
  'confirmOriginalApplicantName',
  require('./appellant-submission-your-details/confirmOriginalApplicantName'),
);

Cypress.Commands.add(
  'confirmNameValue',
  require('./appellant-submission-your-details/confirmNameValue'),
);

Cypress.Commands.add(
  'confirmEmailValue',
  require('./appellant-submission-your-details/confirmEmailValue'),
);

Cypress.Commands.add(
  'confirmNameValueNotSet',
  require('./appellant-submission-your-details/confirmNameValueNotSet'),
);

Cypress.Commands.add(
  'confirmEmailValueNotSet',
  require('./appellant-submission-your-details/confirmEmailValueNotSet'),
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
  'confirmYourDetailsStatus',
  require('./appellant-submission-your-details/confirmYourDetailsStatus'),
);

Cypress.Commands.add(
  'confirmApplicantNameWasAccepted',
  require('./appellant-submission-your-details/confirmApplicantNameWasAccepted'),
);

Cypress.Commands.add(
  'confirmApplicantNameWasRejected',
  require('./appellant-submission-your-details/confirmApplicantNameWasRejected'),
);

Cypress.Commands.add(
  'provideApplicantName',
  require('./appellant-submission-your-details/provideApplicantName'),
);

Cypress.Commands.add(
  'confirmApplicantNameValue',
  require('./appellant-submission-your-details/confirmApplicantNameValue'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationAccepted',
  require('./appellant-submission-upload-application/confirmPlanningApplicationAccepted'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationFileIsUploaded',
  require('./appellant-submission-upload-application/confirmPlanningApplicationFileIsUploaded'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationIsNotUploaded',
  require('./appellant-submission-upload-application/confirmPlanningApplicationIsNotUploaded'),
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
  'goToDecisionLetterPage',
  require('./appellant-submission-decision-letter/goToDecisionLetterPage'),
);

Cypress.Commands.add(
  'uploadDecisionLetterFile',
  require('./appellant-submission-decision-letter/uploadDecisionLetterFile'),
);

Cypress.Commands.add(
  'confirmDecisionLetterAccepted',
  require('./appellant-submission-decision-letter/confirmDecisionLetterAccepted'),
);

Cypress.Commands.add(
  'confirmDecisionLetterFileIsUploaded',
  require('./appellant-submission-decision-letter/confirmDecisionLetterFileIsUploaded'),
);

Cypress.Commands.add(
  'confirmDecisionLetterIsNotUploaded',
  require('./appellant-submission-decision-letter/confirmDecisionLetterIsNotUploaded'),
);

Cypress.Commands.add(
  'confirmDecisionLetterRejectedBecause',
  require('./appellant-submission-decision-letter/confirmDecisionLetterRejectedBecause'),
);

Cypress.Commands.add(
  'goToCheckYourAnswersPage',
  require('./appellant-submission-check-your-answers/goToCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'confirmSubmissionPage',
  require('./appellant-submission-check-your-answers/confirmSubmissionPage'),
);

Cypress.Commands.add(
  'acceptTermsAndConditions',
  require('./appellant-confirms-ts-and-cs/acceptTermsAndConditions'),
);

Cypress.Commands.add(
  'doNotAcceptTermsAndConditions',
  require('./appellant-confirms-ts-and-cs/doNotAcceptTermsAndConditions'),
);

Cypress.Commands.add(
  'confirmTermsAndConditionsAreRequired',
  require('./appellant-confirms-ts-and-cs/confirmTermsAndConditionsAreRequired'),
);

Cypress.Commands.add(
  'confirmAppealSubmitted',
  require('./appellant-confirms-ts-and-cs/confirmAppealSubmitted'),
);

Cypress.Commands.add(
  'confirmAppealNotSubmitted',
  require('./appellant-confirms-ts-and-cs/confirmAppealNotSubmitted'),
);

Cypress.Commands.add(
  'promptUserToProvidePlanningApplicationNumber',
  require('./appellant-submission-planning-application-number/promptUserToProvidePlanningApplicationNumber'),
);

Cypress.Commands.add(
  'providePlanningApplicationNumber',
  require('./appellant-submission-planning-application-number/providePlanningApplicationNumber'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationNumberHasUpdated',
  require('./appellant-submission-planning-application-number/confirmPlanningApplicationNumberHasUpdated'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationNumberHasNotUpdated',
  require('./appellant-submission-planning-application-number/confirmPlanningApplicationNumberHasNotUpdated'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationNumberRejectedBecause',
  require('./appellant-submission-planning-application-number/confirmPlanningApplicationNumberRejectedBecause'),
);

Cypress.Commands.add(
  'selectToProvidePlanningApplicationNumber',
  require('./appeal-submission-tasklist/selectToProvidePlanningApplicationNumber'),
);

Cypress.Commands.add(
  'confirmUserPresentedWithProvidePlanningApplicationNumber',
  require('./appeal-submission-tasklist/confirmUserPresentedWithProvidePlanningApplicationNumber'),
);
