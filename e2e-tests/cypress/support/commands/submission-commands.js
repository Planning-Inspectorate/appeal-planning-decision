Cypress.Commands.add(
  'confirmFeedbackLinkIsDisplayedInPageBody',
  require('../appeal-submission/confirmFeedbackLinkIsDisplayedInPageBody'),
);

Cypress.Commands.add(
  'checkNoSensitiveInformation',
  require('../appeal-statement-submission/checkNoSensitiveInformation'),
);

Cypress.Commands.add(
  'confirmThatNoErrorTriggered',
  require('../appeal-statement-submission/confirmThatNoErrorTriggered'),
);

Cypress.Commands.add(
  'confirmFileUploadIsRequested',
  require('../appeal-statement-submission/confirmFileUploadIsRequested'),
);

Cypress.Commands.add(
  'confirmAppealStatementFileIsNotUploaded',
  require('../appeal-statement-submission/confirmAppealStatementFileIsNotUploaded'),
);

Cypress.Commands.add(
  'confirmAppealStatementFileIsUploaded',
  require('../appeal-statement-submission/confirmAppealStatementFileIsUploaded'),
);

Cypress.Commands.add(
  'confirmFileContainsSensitiveInformation',
  require('../appeal-statement-submission/confirmFileContainsSensitiveInformation'),
);

Cypress.Commands.add(
  'confirmFileInvalidBecauseExceedsSizeLimit',
  require('../appeal-statement-submission/confirmFileInvalidBecauseExceedsSizeLimit'),
);

Cypress.Commands.add(
  'confirmFileInvalidBecauseWrongFileType',
  require('../appeal-statement-submission/confirmFileInvalidBecauseWrongFileType'),
);

Cypress.Commands.add(
  'uncheckNoSensitiveInformation',
  require('../appeal-statement-submission/uncheckNoSensitiveInformation'),
);

Cypress.Commands.add(
  'uploadAppealStatementFile',
  require('../appeal-statement-submission/uploadAppealStatementFile'),
);

Cypress.Commands.add(
  'clickUploadFiles',
  require('../appellant-submission-supporting-documents/clickUploadFiles'),
);

Cypress.Commands.add(
  'confirmSupportingDocumentAccepted',
  require('../appellant-submission-supporting-documents/confirmSupportingDocumentAccepted'),
);

Cypress.Commands.add(
  'confirmNumberSupportingDocumentsAccepted',
  require('../appellant-submission-supporting-documents/confirmNumberSupportingDocumentsAccepted'),
);

Cypress.Commands.add(
  'confirmSupportingDocumentRejectedBecause',
  require('../appellant-submission-supporting-documents/confirmSupportingDocumentRejectedBecause'),
);

Cypress.Commands.add(
  'uploadSupportingDocuments',
  require('../appellant-submission-supporting-documents/uploadSupportingDocuments'),
);

Cypress.Commands.add(
  'confirmSiteAddressWasAccepted',
  require('../appeal-submission-appeal-site-address/confirmSiteAddressWasAccepted'),
);

Cypress.Commands.add(
  'confirmSiteAddressValue',
  require('../appeal-submission-appeal-site-address/confirmSiteAddressValue'),
);

Cypress.Commands.add(
  'confirmSiteAddressWasRejectedBecause',
  require('../appeal-submission-appeal-site-address/confirmSiteAddressWasRejectedBecause'),
);

Cypress.Commands.add(
  'provideAddressLine1',
  require('../appeal-submission-appeal-site-address/provideAddressLine1'),
);

Cypress.Commands.add(
  'provideAddressLine2',
  require('../appeal-submission-appeal-site-address/provideAddressLine2'),
);

Cypress.Commands.add(
  'confirmSiteAddressWasAccepted',
  require('../appeal-submission-appeal-site-address/confirmSiteAddressWasAccepted'),
);

Cypress.Commands.add(
  'provideCounty',
  require('../appeal-submission-appeal-site-address/provideCounty'),
);

Cypress.Commands.add(
  'providePostcode',
  require('../appeal-submission-appeal-site-address/providePostcode'),
);

Cypress.Commands.add(
  'provideTownOrCity',
  require('../appeal-submission-appeal-site-address/provideTownOrCity'),
);

Cypress.Commands.add(
  'answerCannotSeeTheWholeAppeal',
  require('../appeal-submission-access-to-appeal-site/answerCannotSeeTheWholeAppeal'),
);

Cypress.Commands.add(
  'answerCanSeeTheWholeAppeal',
  require('../appeal-submission-access-to-appeal-site/answerCanSeeTheWholeAppeal'),
);

Cypress.Commands.add(
  'confirmAccessSiteWasRejectedBecause',
  require('../appeal-submission-access-to-appeal-site/confirmAccessSiteWasRejectedBecause'),
);

Cypress.Commands.add(
  'confirmAccessSiteAnswered',
  require('../appeal-submission-access-to-appeal-site/confirmAccessSiteAnswered'),
);

Cypress.Commands.add(
  'confirmAccessSiteNotSubmitted',
  require('../appeal-submission-access-to-appeal-site/confirmAccessSiteNotSubmitted'),
);

Cypress.Commands.add(
  'provideMoreDetails',
  require('../appeal-submission-access-to-appeal-site/provideMoreDetails'),
);

Cypress.Commands.add(
  'answerHaveNotToldOtherOwnersAppeal',
  require('../appeal-submission-appeal-site-ownership/answerHaveNotToldOtherOwnersAppeal'),
);

Cypress.Commands.add(
  'answerHaveToldOtherOwnersAppeal',
  require('../appeal-submission-appeal-site-ownership/answerHaveToldOtherOwnersAppeal'),
);

Cypress.Commands.add(
  'answerDoesNotOwnTheWholeAppeal',
  require('../appeal-submission-appeal-site-ownership/answerDoesNotOwnTheWholeAppeal'),
);

Cypress.Commands.add(
  'answerOwnsTheWholeAppeal',
  require('../appeal-submission-appeal-site-ownership/answerOwnsTheWholeAppeal'),
);

Cypress.Commands.add(
  'confirmSiteOwnershipRejectedBecause',
  require('../appeal-submission-appeal-site-ownership/confirmSiteOwnershipRejectedBecause'),
);

Cypress.Commands.add(
  'confirmOtherOwnersAsked',
  require('../appeal-submission-appeal-site-ownership/confirmOtherOwnersAsked'),
);

Cypress.Commands.add(
  'confirmOtherSiteOwnerToldAnswered',
  require('../appeal-submission-appeal-site-ownership/confirmOtherSiteOwnerToldAnswered'),
);

Cypress.Commands.add(
  'confirmSiteOwnershipAccepted',
  require('../appeal-submission-appeal-site-ownership/confirmSiteOwnershipAccepted'),
);

Cypress.Commands.add(
  'confirmWholeSiteOwnerAnswered',
  require('../appeal-submission-appeal-site-ownership/confirmWholeSiteOwnerAnswered'),
);

Cypress.Commands.add(
  'answerSiteHasIssues',
  require('../appeal-submission-site-health-and-safety-issues/answerSiteHasIssues'),
);

Cypress.Commands.add(
  'answerSiteHasNoIssues',
  require('../appeal-submission-site-health-and-safety-issues/answerSiteHasNoIssues'),
);

Cypress.Commands.add(
  'confirmHealthAndSafetyPage',
  require('../appeal-submission-site-health-and-safety-issues/confirmHealthAndSafetyPage'),
);

Cypress.Commands.add(
  'confirmSiteSafetyRejectedBecause',
  require('../appeal-submission-site-health-and-safety-issues/confirmSiteSafetyRejectedBecause'),
);

Cypress.Commands.add(
  'isSafetyIssuesInputPresented',
  require('../appeal-submission-site-health-and-safety-issues/isSafetyIssuesInputPresented'),
);

Cypress.Commands.add(
  'provideSafetyIssues',
  require('../appeal-submission-site-health-and-safety-issues/provideSafetyIssuesConcerns'),
);

Cypress.Commands.add(
  'provideSafetyIssuesConcerns',
  require('../appeal-submission-site-health-and-safety-issues/provideSafetyIssuesConcerns'),
);

Cypress.Commands.add(
  'confirmSafetyIssuesConcernsValue',
  require('../appeal-submission-site-health-and-safety-issues/confirmSafetyIssuesConcernsValue'),
);

Cypress.Commands.add(
  'confirmSiteHasIssuesAnswered',
  require('../appeal-submission-site-health-and-safety-issues/confirmSiteHasIssuesAnswered'),
);

Cypress.Commands.add(
  'checkStatusForTask',
  require('../appeal-submission-tasklist/checkStatusForTask'),
);

Cypress.Commands.add(
  'confirmTaskIsAvailableForSelection',
  require('../appeal-submission-tasklist/confirmTaskIsAvailableForSelection'),
);

Cypress.Commands.add(
  'confirmTaskIsNotAvailableForSelection',
  require('../appeal-submission-tasklist/confirmTaskIsNotAvailableForSelection'),
);

Cypress.Commands.add(
  'selectToUploadAppealSubmissionDocument',
  require('../appeal-submission-tasklist/selectToUploadAppealSubmissionDocument'),
);

Cypress.Commands.add(
  'confirmUserPresentedWithUploadAppealSubmissionDocument',
  require('../appeal-submission-tasklist/confirmUserPresentedWithUploadAppealSubmissionDocument'),
);

Cypress.Commands.add(
  'answerYesOriginalAppellant',
  require('../appellant-submission-your-details/provideAnswerYes'),
);
Cypress.Commands.add(
  'answerNoOriginalAppellant',
  require('../appellant-submission-your-details/provideAnswerNo'),
);

Cypress.Commands.add(
  'confirmAnswered',
  require('../appellant-submission-your-details/confirmAnswered'),
);

Cypress.Commands.add(
  'confirmAreYouOriginalApplicant',
  require('../appellant-submission-your-details/confirmAreYouOriginalApplicant'),
);

Cypress.Commands.add(
  'confirmOriginalAppellantAsked',
  require('../appellant-submission-your-details/confirmOriginalAppellantAsked'),
);

Cypress.Commands.add(
  'confirmOriginalAppellantNotAsked',
  require('../appellant-submission-your-details/confirmOriginalAppellantNotAsked'),
);

Cypress.Commands.add(
  'confirmWhoAreYouRejectedBecause',
  require('../appellant-submission-your-details/confirmWhoAreYouRejectedBecause'),
);

Cypress.Commands.add(
  'provideAreYouOriginalApplicant',
  require('../appellant-submission-your-details/provideAreYouOriginalApplicant'),
);

Cypress.Commands.add(
  'provideDetailsName',
  require('../appellant-submission-your-details/provideDetailsName'),
);

Cypress.Commands.add(
  'provideDetailsEmail',
  require('../appellant-submission-your-details/provideDetailsEmail'),
);

Cypress.Commands.add(
  'provideNameOfOriginalApplicant',
  require('../appellant-submission-your-details/provideNameOfOriginalApplicant'),
);

Cypress.Commands.add(
  'confirmOriginalApplicantWasRejected',
  require('../appellant-submission-your-details/confirmOriginalApplicantWasRejected'),
);

Cypress.Commands.add(
  'confirmOriginalApplicantName',
  require('../appellant-submission-your-details/confirmOriginalApplicantName'),
);

Cypress.Commands.add(
  'confirmNameValue',
  require('../appellant-submission-your-details/confirmNameValue'),
);

Cypress.Commands.add(
  'confirmEmailValue',
  require('../appellant-submission-your-details/confirmEmailValue'),
);

Cypress.Commands.add(
  'confirmNameValueNotSet',
  require('../appellant-submission-your-details/confirmNameValueNotSet'),
);

Cypress.Commands.add(
  'confirmEmailValueNotSet',
  require('../appellant-submission-your-details/confirmEmailValueNotSet'),
);

Cypress.Commands.add(
  'confirmDetailsWasAccepted',
  require('../appellant-submission-your-details/confirmDetailsWasAccepted'),
);

Cypress.Commands.add(
  'confirmDetailsWasRejected',
  require('../appellant-submission-your-details/confirmDetailsWasRejected'),
);

Cypress.Commands.add(
  'confirmYourDetailsStatus',
  require('../appellant-submission-your-details/confirmYourDetailsStatus'),
);

Cypress.Commands.add(
  'confirmApplicantNameWasAccepted',
  require('../appellant-submission-your-details/confirmApplicantNameWasAccepted'),
);

Cypress.Commands.add(
  'confirmApplicantNameWasRejected',
  require('../appellant-submission-your-details/confirmApplicantNameWasRejected'),
);

Cypress.Commands.add(
  'provideApplicantName',
  require('../appellant-submission-your-details/provideApplicantName'),
);

Cypress.Commands.add(
  'confirmApplicantNameValue',
  require('../appellant-submission-your-details/confirmApplicantNameValue'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationAccepted',
  require('../appellant-submission-upload-application/confirmPlanningApplicationAccepted'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationFileIsUploaded',
  require('../appellant-submission-upload-application/confirmPlanningApplicationFileIsUploaded'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationIsNotUploaded',
  require('../appellant-submission-upload-application/confirmPlanningApplicationIsNotUploaded'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationRejectedBecause',
  require('../appellant-submission-upload-application/confirmPlanningApplicationRejectedBecause'),
);

Cypress.Commands.add(
  'uploadPlanningApplicationFile',
  require('../appellant-submission-upload-application/uploadPlanningApplicationFile'),
);

Cypress.Commands.add(
  'uploadDecisionLetterFile',
  require('../appellant-submission-decision-letter/uploadDecisionLetterFile'),
);

Cypress.Commands.add(
  'confirmDecisionLetterAccepted',
  require('../appellant-submission-decision-letter/confirmDecisionLetterAccepted'),
);

Cypress.Commands.add(
  'confirmDecisionLetterFileIsUploaded',
  require('../appellant-submission-decision-letter/confirmDecisionLetterFileIsUploaded'),
);

Cypress.Commands.add(
  'confirmDecisionLetterIsNotUploaded',
  require('../appellant-submission-decision-letter/confirmDecisionLetterIsNotUploaded'),
);

Cypress.Commands.add(
  'confirmDecisionLetterRejectedBecause',
  require('../appellant-submission-decision-letter/confirmDecisionLetterRejectedBecause'),
);

Cypress.Commands.add(
  'confirmSubmissionPage',
  require('../appellant-submission-check-your-answers/confirmSubmissionPage'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersPage',
  require('../appellant-submission-check-your-answers/confirmCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'agreeToTheDeclaration',
  require('../appellant-confirms-declaration/agreeToTheDeclaration'),
);

Cypress.Commands.add(
  'doNotAgreeToTheDeclaration',
  require('../appellant-confirms-declaration/doNotAgreeToTheDeclaration'),
);

Cypress.Commands.add(
  'confirmDeclarationAreRequired',
  require('../appellant-confirms-declaration/confirmDeclarationAreRequired'),
);

Cypress.Commands.add(
  'confirmAppealSubmitted',
  require('../appellant-confirms-declaration/confirmAppealSubmitted'),
);

Cypress.Commands.add(
  'confirmAppealNotSubmitted',
  require('../appellant-confirms-declaration/confirmAppealNotSubmitted'),
);

Cypress.Commands.add(
  'providePlanningApplicationNumber',
  require('../appellant-submission-planning-application-number/providePlanningApplicationNumber'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationNumberHasUpdated',
  require('../appellant-submission-planning-application-number/confirmPlanningApplicationNumberHasUpdated'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationNumberHasNotUpdated',
  require('../appellant-submission-planning-application-number/confirmPlanningApplicationNumberHasNotUpdated'),
);

Cypress.Commands.add(
  'confirmPlanningApplicationNumberRejectedBecause',
  require('../appellant-submission-planning-application-number/confirmPlanningApplicationNumberRejectedBecause'),
);

Cypress.Commands.add(
  'selectToProvidePlanningApplicationNumber',
  require('../appeal-submission-tasklist/selectToProvidePlanningApplicationNumber'),
);

Cypress.Commands.add(
  'confirmUserPresentedWithProvidePlanningApplicationNumber',
  require('../appeal-submission-tasklist/confirmUserPresentedWithProvidePlanningApplicationNumber'),
);

Cypress.Commands.add(
  'validateIndividualFileUpload',
  require('../file-upload/validateIndividualFileUpload'),
);

Cypress.Commands.add(
  'userIsNavigatedToPage',
  require('../appeal-navigation/userIsNavigatedToPage'),
);

Cypress.Commands.add(
  'accessSection',
  require('../appellant-submission-check-your-answers/accessSection'),
);

Cypress.Commands.add(
  'provideCompleteAppeal',
  require('../appellant-submission-check-your-answers/provideCompleteAppeal'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayItem',
  require('../appellant-submission-check-your-answers/confirmCheckYourAnswersDisplayItem'),
);

Cypress.Commands.add(
  'clickCheckYourAnswers',
  require('../appeal-navigation/clickCheckYourAnswers'),
);
