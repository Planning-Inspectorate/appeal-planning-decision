// NAVIGATION
Cypress.Commands.add('clickSaveAndContinue', require('./appeal-navigation/clickSaveAndContinue'));

Cypress.Commands.add(
  'goToPageNotFoundPage',
  require('./integration-with-acp/goToPageNotFoundPage'),
);

Cypress.Commands.add(
  'goToStartAppealPage',
  require('./appeal-navigation/eligibility/goToStartAppealPage'),
);

Cypress.Commands.add(
  'goToPlanningDepartmentPage',
  require('./appeal-navigation/eligibility/goToPlanningDepartmentPage'),
);

Cypress.Commands.add(
  'goToCostsPage',
  require('./appeal-navigation/eligibility/goToCostsPage'),
);

Cypress.Commands.add(
  'goToPlanningDepartmentOutPage',
  require('./appeal-navigation/eligibility/goToPlanningDepartmentOutPage'),
);

Cypress.Commands.add(
  'goToListedBuildingPage',
  require('./appeal-navigation/eligibility/goToListedBuildingPage'),
);

Cypress.Commands.add(
  'goToListedBuildingOutPage',
  require('./appeal-navigation/eligibility/goToListedBuildingOutPage'),
);

Cypress.Commands.add(
  'goToDecisionDatePage',
  require('./appeal-navigation/eligibility/goToDecisionDatePage'),
);

Cypress.Commands.add(
  'goToDecisionDateExpiredPage',
  require('./appeal-navigation/eligibility/goToDecisionDateExpiredPage'),
);

Cypress.Commands.add(
  'goToNoDecisionDatePage',
  require('./appeal-navigation/eligibility/goToNoDecisionDatePage'),
);

Cypress.Commands.add(
  'goToAppealStatementInfoPage',
  require('./appeal-navigation/eligibility/goToAppealStatementInfoPage'),
);

Cypress.Commands.add(
  'goToAppealStatementSubmission',
  require('./appeal-navigation/appellant-submission/goToAppealStatementSubmission'),
);

Cypress.Commands.add(
  'goToSupportingDocumentsPage',
  require('./appeal-navigation/appellant-submission/goToSupportingDocumentsPage'),
);

Cypress.Commands.add(
  'goToSiteAddressPage',
  require('./appeal-navigation/appellant-submission/goToSiteAddressPage'),
);

Cypress.Commands.add(
  'goToAccessSitePage',
  require('./appeal-navigation/appellant-submission/goToAccessSitePage'),
);

Cypress.Commands.add(
  'goToOtherSiteOwnerToldPage',
  require('./appeal-navigation/appellant-submission/goToOtherSiteOwnerToldPage'),
);

Cypress.Commands.add(
  'goToWholeSiteOwnerPage',
  require('./appeal-navigation/appellant-submission/goToWholeSiteOwnerPage'),
);

Cypress.Commands.add(
  'goToHealthAndSafetyPage',
  require('./appeal-navigation/appellant-submission/goToHealthAndSafetyPage'),
);

Cypress.Commands.add(
  'goToTaskListPage',
  require('./appeal-navigation/appellant-submission/goToTaskListPage'),
);

Cypress.Commands.add(
  'goToYourDetailsPage',
  require('./appeal-navigation/appellant-submission/goToYourDetailsPage'),
);

Cypress.Commands.add(
  'goToWhoAreYouPage',
  require('./appeal-navigation/appellant-submission/goToWhoAreYouPage'),
);

Cypress.Commands.add(
  'goToApplicantNamePage',
  require('./appeal-navigation/appellant-submission/goToApplicantNamePage'),
);

Cypress.Commands.add(
  'goToTaskListPage',
  require('./appeal-navigation/appellant-submission/goToTaskListPage'),
);

Cypress.Commands.add(
  'goToPlanningApplicationSubmission',
  require('./appeal-navigation/appellant-submission/goToPlanningApplicationSubmission'),
);

Cypress.Commands.add(
  'goToDecisionLetterPage',
  require('./appeal-navigation/appellant-submission/goToDecisionLetterPage'),
);

Cypress.Commands.add(
  'goToCheckYourAnswersPage',
  require('./appeal-navigation/appellant-submission/goToCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'goToSubmissionPage',
  require('./appeal-navigation/appellant-submission/goToSubmissionPage'),
);

Cypress.Commands.add(
  'goToPlanningApplicationNumberPage',
  require('./appeal-navigation/appellant-submission/goToPlanningApplicationNumberPage'),
);

Cypress.Commands.add(
  'promptUserToProvidePlanningApplicationNumber',
  require('./appeal-navigation/appellant-submission/goToPlanningApplicationNumberPage'),
);

Cypress.Commands.add(
  'confirmTermsAndConditionsLinkDisplayed',
  require('./appeal-header-footer/confirmTermsAndConditionsLinkDisplayed'),
);

Cypress.Commands.add(
  'confirmFeedbackLinkIsDisplayed',
  require('./appeal-header-footer/confirmFeedbackLinkIsDisplayed'),
);

Cypress.Commands.add(
  'confirmBackButtonDisplayed',
  require('./appeal-header-footer/confirmBackButtonDisplayed'),
);

Cypress.Commands.add(
  'confirmBackButtonNotDisplayed',
  require('./appeal-header-footer/confirmBackButtonNotDisplayed'),
);

Cypress.Commands.add(
  'confirmFeedbackLinkIsDisplayedInPageBody',
  require('./appeal-submission/confirmFeedbackLinkIsDisplayedInPageBody'),
);

Cypress.Commands.add(
  'confirmPrivacyLinkDisplayed',
  require('./appeal-header-footer/confirmPrivacyLinkDisplayed'),
);

Cypress.Commands.add(
  'confirmGoogleAnalyticsLinkIsPresent',
  require('./appeal-header-footer/confirmGoogleAnalyticsLinkIsPresent'),
);

Cypress.Commands.add(
  'provideDecisionDate',
  require('./eligibility-decision-date/provideDecisionDate'),
);

Cypress.Commands.add(
  'confirmDecisionDate',
  require('./eligibility-decision-date/confirmDecisionDate'),
);

Cypress.Commands.add(
  'accessConfirmHavingNoDecisionDate',
  require('./eligibility-decision-date/accessConfirmHavingNoDecisionDate'),
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
  'provideIneligibleLocalPlanningDepartment',
  require('./eligibility-local-planning-department/provideIneligibleLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'provideEligibleLocalPlanningDepartment',
  require('./eligibility-local-planning-department/provideEligibleLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'confirmIneligibleLocalPlanningDepartment',
  require('./eligibility-local-planning-department/confirmIneligibleLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'confirmEligibleLocalPlanningDepartment',
  require('./eligibility-local-planning-department/confirmEligibleLocalPlanningDepartment'),
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
  'confirmPlanningDepartmentSelected',
  require('./eligibility-local-planning-department/confirmPlanningDepartmentSelected'),
);

Cypress.Commands.add(
  'confirmRedirectToExternalService',
  require('./eligibility-local-planning-department/confirmRedirectToExternalService'),
);

Cypress.Commands.add(
  'confirmProvidedLocalPlanningDepartmentWasAccepted',
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
  'uncheckNoSensitiveInformation',
  require('./appeal-statement-submission/uncheckNoSensitiveInformation'),
);

Cypress.Commands.add(
  'uploadAppealStatementFile',
  require('./appeal-statement-submission/uploadAppealStatementFile'),
);

Cypress.Commands.add(
  'clickUploadFiles',
  require('./appellant-submission-supporting-documents/clickUploadFiles'),
);

Cypress.Commands.add(
  'confirmSupportingDocumentAccepted',
  require('./appellant-submission-supporting-documents/confirmSupportingDocumentAccepted'),
);

Cypress.Commands.add(
  'confirmNumberSupportingDocumentsAccepted',
  require('./appellant-submission-supporting-documents/confirmNumberSupportingDocumentsAccepted'),
);

Cypress.Commands.add(
  'confirmSupportingDocumentRejectedBecause',
  require('./appellant-submission-supporting-documents/confirmSupportingDocumentRejectedBecause'),
);

Cypress.Commands.add(
  'uploadSupportingDocuments',
  require('./appellant-submission-supporting-documents/uploadSupportingDocuments'),
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
  'answerSiteHasIssues',
  require('./appeal-submission-site-health-and-safety-issues/answerSiteHasIssues'),
);

Cypress.Commands.add(
  'answerSiteHasNoIssues',
  require('./appeal-submission-site-health-and-safety-issues/answerSiteHasNoIssues'),
);

Cypress.Commands.add(
  'confirmHealthAndSafetyPage',
  require('./appeal-submission-site-health-and-safety-issues/confirmHealthAndSafetyPage'),
);

Cypress.Commands.add(
  'confirmSiteSafetyRejectedBecause',
  require('./appeal-submission-site-health-and-safety-issues/confirmSiteSafetyRejectedBecause'),
);

Cypress.Commands.add(
  'isSafetyIssuesInputPresented',
  require('./appeal-submission-site-health-and-safety-issues/isSafetyIssuesInputPresented'),
);

Cypress.Commands.add(
  'provideSafetyIssues',
  require('./appeal-submission-site-health-and-safety-issues/provideSafetyIssuesConcerns'),
);

Cypress.Commands.add(
  'provideSafetyIssuesConcerns',
  require('./appeal-submission-site-health-and-safety-issues/provideSafetyIssuesConcerns'),
);

Cypress.Commands.add(
  'confirmSafetyIssuesConcernsValue',
  require('./appeal-submission-site-health-and-safety-issues/confirmSafetyIssuesConcernsValue'),
);

Cypress.Commands.add(
  'confirmSiteHasIssuesAnswered',
  require('./appeal-submission-site-health-and-safety-issues/confirmSiteHasIssuesAnswered'),
);

Cypress.Commands.add(
  'checkStatusForTask',
  require('./appeal-submission-tasklist/checkStatusForTask'),
);

Cypress.Commands.add(
  'confirmTaskIsAvailableForSelection',
  require('./appeal-submission-tasklist/confirmTaskIsAvailableForSelection'),
);

Cypress.Commands.add(
  'confirmTaskIsNotAvailableForSelection',
  require('./appeal-submission-tasklist/confirmTaskIsNotAvailableForSelection'),
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
  'confirmNavigationAcpPage',
  require('./integration-with-acp/confirmNavigationAcpPage'),
);

Cypress.Commands.add(
  'confirmNavigationTermsAndConditionsPage',
  require('./appeal-navigation-confirmation/appellant-submission/confirmNavigationTermsAndConditionsPage'),
);

Cypress.Commands.add(
  'confirmNavigationPageNotFoundPage',
  require('./integration-with-acp/confirmNavigationPageNotFoundPage'),
);

Cypress.Commands.add(
  'confirmNavigationLocalPlanningDepartmentPage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationLocalPlanningDepartmentPage'),
);

Cypress.Commands.add(
  'confirmTextOnPage',
  require('./appeal-navigation-confirmation/eligibility/confirmTextOnPage'),
);

Cypress.Commands.add(
  'confirmNavigationCostsPage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationCostsPage'),
);

Cypress.Commands.add(
  'confirmNavigationCostsOutPage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationCostsOutPage'),
);

Cypress.Commands.add(
  'confirmNavigationListedBuildingPage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationListedBuildingPage'),
);

Cypress.Commands.add(
  'confirmNavigationDecisionDatePage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDatePage'),
);

Cypress.Commands.add(
  'confirmNavigationNoDecisionDatePage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationNoDecisionDatePage'),
);

Cypress.Commands.add(
  'confirmNavigationYourAppealStatementPage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationYourAppealStatementPage'),
);

Cypress.Commands.add(
  'confirmNavigationDecisionDateExpiredPage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDateExpiredPage'),
);

Cypress.Commands.add(
  'confirmNavigationDecisionDateAbsentPage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDateAbsentPage'),
);

Cypress.Commands.add(
  'confirmNavigationEnforcementNoticePage',
  require('./appeal-navigation-confirmation/eligibility/confirmNavigationEnforcementNoticePage'),
);

Cypress.Commands.add(
  'confirmNavigationYourDetailsPage',
  require('./appellant-submission-your-details/confirmNavigationYourDetailsPage'),
);

Cypress.Commands.add(
  'confirmNavigationWhoAreYouPage',
  require('./appellant-submission-your-details/confirmNavigationWhoAreYouPage'),
);

Cypress.Commands.add(
  'confirmNavigationApplicantNamePage',
  require('./appellant-submission-your-details/confirmNavigationApplicantNamePage'),
);

Cypress.Commands.add(
  'confirmNavigationTaskListPage',
  require('./appellant-submission-your-details/confirmNavigationTaskListPage'),
);

Cypress.Commands.add(
  'confirmNavigationPlanningApplicationNumberPage',
  require('./appeal-navigation-confirmation/appellant-submission/confirmNavigationPlanningApplicationNumberPage'),
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
  'uploadPlanningApplicationFile',
  require('./appellant-submission-upload-application/uploadPlanningApplicationFile'),
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
  'confirmSubmissionPage',
  require('./appellant-submission-check-your-answers/confirmSubmissionPage'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersPage',
  require('./appellant-submission-check-your-answers/confirmCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'agreeToTheDeclaration',
  require('./appellant-confirms-declaration/agreeToTheDeclaration'),
);

Cypress.Commands.add(
  'doNotAgreeToTheDeclaration',
  require('./appellant-confirms-declaration/doNotAgreeToTheDeclaration'),
);

Cypress.Commands.add(
  'confirmDeclarationAreRequired',
  require('./appellant-confirms-declaration/confirmDeclarationAreRequired'),
);

Cypress.Commands.add(
  'confirmAppealSubmitted',
  require('./appellant-confirms-declaration/confirmAppealSubmitted'),
);

Cypress.Commands.add(
  'confirmAppealNotSubmitted',
  require('./appellant-confirms-declaration/confirmAppealNotSubmitted'),
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

Cypress.Commands.add(
  'validateIndividualFileUpload',
  require('./file-upload/validateIndividualFileUpload'),
);

Cypress.Commands.add('userIsNavigatedToPage', require('./appeal-navigation/userIsNavigatedToPage'));

Cypress.Commands.add(
  'goToSiteSafetyPage',
  require('./appeal-navigation/appellant-submission/goToSiteSafetyPage'),
);

Cypress.Commands.add(
  'accessSection',
  require('./appellant-submission-check-your-answers/accessSection'),
);

Cypress.Commands.add(
  'provideCompleteAppeal',
  require('./appellant-submission-check-your-answers/provideCompleteAppeal'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayItem',
  require('./appellant-submission-check-your-answers/confirmCheckYourAnswersDisplayItem'),
);

Cypress.Commands.add('clickCheckYourAnswers', require('./appeal-navigation/clickCheckYourAnswers'));

Cypress.Commands.add(
  'goToEnforcementNoticePage',
  require('./appeal-navigation/eligibility/goToEnforcementNoticePage'),
);

Cypress.Commands.add(
  'provideEnforcementNoticeAnswer',
  require('./eligibility-enforcement-notice/provideEnforcementNoticeAnswer'),
);

Cypress.Commands.add(
  'confirmThatEnforcementNoticeAnswerIsRequired',
  require('./eligibility-enforcement-notice/confirmThatEnforcementNoticeAnswerIsRequired'),
);

Cypress.Commands.add(
  'confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals',
  require('./eligibility-enforcement-notice/confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals'),
);

Cypress.Commands.add(
  'confirmProgressIsMadeToListingBuildingEligibilityQuestion',
  require('./eligibility-enforcement-notice/confirmProgressIsMadeToListingBuildingEligibilityQuestion'),
);

Cypress.Commands.add(
  'provideCostsAnswerNo',
  require('./eligibility-costs/provideCostsAnswerNo'),
);

Cypress.Commands.add(
  'provideCostsAnswerYes',
  require('./eligibility-costs/provideCostsAnswerYes'),
);

Cypress.Commands.add(
  'confirmAcpLinkDisplayed',
  require('./eligibility-costs/confirmAcpLinkDisplayed'),
);

Cypress.Commands.add(
  'confirmGuidanceLinkDisplayed',
  require('./eligibility-costs/confirmGuidanceLinkDisplayed'),
);
