Cypress.Commands.add(
  'confirmTermsAndConditionsLinkDisplayed',
  require('../appeal-header-footer/confirmTermsAndConditionsLinkDisplayed'),
);

Cypress.Commands.add(
  'confirmFeedbackLinkIsDisplayed',
  require('../appeal-header-footer/confirmFeedbackLinkIsDisplayed'),
);

Cypress.Commands.add(
  'confirmBackButtonDisplayed',
  require('../appeal-header-footer/confirmBackButtonDisplayed'),
);

Cypress.Commands.add(
  'confirmBackButtonNotDisplayed',
  require('../appeal-header-footer/confirmBackButtonNotDisplayed'),
);

Cypress.Commands.add(
  'confirmPrivacyLinkDisplayed',
  require('../appeal-header-footer/confirmPrivacyLinkDisplayed'),
);

Cypress.Commands.add(
  'confirmGoogleAnalyticsLinkIsPresent',
  require('../appeal-header-footer/confirmGoogleAnalyticsLinkIsPresent'),
);

Cypress.Commands.add('clickSaveAndContinue', require('../appeal-navigation/clickSaveAndContinue'));

Cypress.Commands.add(
  'goToPageNotFoundPage',
  require('../integration-with-acp/goToPageNotFoundPage'),
);

Cypress.Commands.add(
  'goToStartAppealPage',
  require('../appeal-navigation/eligibility/goToStartAppealPage'),
);

Cypress.Commands.add(
  'goToLandingPage',
  require('../appeal-navigation/eligibility/goToLandingPage'),
);

Cypress.Commands.add(
  'goToPlanningDepartmentPage',
  require('../appeal-navigation/eligibility/goToPlanningDepartmentPage'),
);

Cypress.Commands.add('goToCostsPage', require('../appeal-navigation/eligibility/goToCostsPage'));

Cypress.Commands.add(
  'goToPlanningDepartmentOutPage',
  require('../appeal-navigation/eligibility/goToPlanningDepartmentOutPage'),
);

Cypress.Commands.add(
  'goToListedBuildingPage',
  require('../appeal-navigation/eligibility/goToListedBuildingPage'),
);

Cypress.Commands.add(
  'goToListedBuildingOutPage',
  require('../appeal-navigation/eligibility/goToListedBuildingOutPage'),
);

Cypress.Commands.add(
  'goToDecisionDatePage',
  require('../appeal-navigation/eligibility/goToDecisionDatePage'),
);

Cypress.Commands.add(
  'goToDecisionDateExpiredPage',
  require('../appeal-navigation/eligibility/goToDecisionDateExpiredPage'),
);

Cypress.Commands.add(
  'goToNoDecisionDatePage',
  require('../appeal-navigation/eligibility/goToNoDecisionDatePage'),
);

Cypress.Commands.add(
  'goToAppealStatementInfoPage',
  require('../appeal-navigation/eligibility/goToAppealStatementInfoPage'),
);

Cypress.Commands.add(
  'goToAppealStatementSubmission',
  require('../appeal-navigation/appellant-submission/goToAppealStatementSubmission'),
);

Cypress.Commands.add(
  'goToSupportingDocumentsPage',
  require('../appeal-navigation/appellant-submission/goToSupportingDocumentsPage'),
);

Cypress.Commands.add(
  'goToSiteAddressPage',
  require('../appeal-navigation/appellant-submission/goToSiteAddressPage'),
);

Cypress.Commands.add(
  'goToAccessSitePage',
  require('../appeal-navigation/appellant-submission/goToAccessSitePage'),
);

Cypress.Commands.add(
  'goToOtherSiteOwnerToldPage',
  require('../appeal-navigation/appellant-submission/goToOtherSiteOwnerToldPage'),
);

Cypress.Commands.add(
  'goToWholeSiteOwnerPage',
  require('../appeal-navigation/appellant-submission/goToWholeSiteOwnerPage'),
);

Cypress.Commands.add(
  'goToHealthAndSafetyPage',
  require('../appeal-navigation/appellant-submission/goToHealthAndSafetyPage'),
);

Cypress.Commands.add(
  'goToTaskListPage',
  require('../appeal-navigation/appellant-submission/goToTaskListPage'),
);

Cypress.Commands.add(
  'goToYourDetailsPage',
  require('../appeal-navigation/appellant-submission/goToYourDetailsPage'),
);

Cypress.Commands.add(
  'goToWhoAreYouPage',
  require('../appeal-navigation/appellant-submission/goToWhoAreYouPage'),
);

Cypress.Commands.add(
  'goToApplicantNamePage',
  require('../appeal-navigation/appellant-submission/goToApplicantNamePage'),
);

Cypress.Commands.add(
  'goToTaskListPage',
  require('../appeal-navigation/appellant-submission/goToTaskListPage'),
);

Cypress.Commands.add(
  'goToPlanningApplicationSubmission',
  require('../appeal-navigation/appellant-submission/goToPlanningApplicationSubmission'),
);

Cypress.Commands.add(
  'goToDecisionLetterPage',
  require('../appeal-navigation/appellant-submission/goToDecisionLetterPage'),
);

Cypress.Commands.add(
  'goToCheckYourAnswersPage',
  require('../appeal-navigation/appellant-submission/goToCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'goToSubmissionPage',
  require('../appeal-navigation/appellant-submission/goToSubmissionPage'),
);

Cypress.Commands.add(
  'goToPlanningApplicationNumberPage',
  require('../appeal-navigation/appellant-submission/goToPlanningApplicationNumberPage'),
);

Cypress.Commands.add(
  'promptUserToProvidePlanningApplicationNumber',
  require('../appeal-navigation/appellant-submission/goToPlanningApplicationNumberPage'),
);

Cypress.Commands.add(
  'confirmNavigationPageNotFoundPage',
  require('../integration-with-acp/confirmNavigationPageNotFoundPage'),
);

Cypress.Commands.add(
  'confirmNavigationHouseholderQuestionPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationHouseholderQuestionPage'),
);

Cypress.Commands.add(
  'confirmNavigationHouseholderQuestionOutPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationHouseholderQuestionOutPage'),
);

Cypress.Commands.add(
  'confirmNavigationLocalPlanningDepartmentPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationLocalPlanningDepartmentPage'),
);

Cypress.Commands.add(
  'confirmTextOnPage',
  require('../appeal-navigation-confirmation/eligibility/confirmTextOnPage'),
);

Cypress.Commands.add(
  'confirmNavigationCostsPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationCostsPage'),
);

Cypress.Commands.add(
  'confirmNavigationCostsOutPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationCostsOutPage'),
);

Cypress.Commands.add(
  'confirmNavigationListedBuildingPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationListedBuildingPage'),
);

Cypress.Commands.add(
  'confirmNavigationDecisionDatePage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDatePage'),
);

Cypress.Commands.add(
  'confirmNavigationNoDecisionDatePage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationNoDecisionDatePage'),
);

Cypress.Commands.add(
  'confirmNavigationYourAppealStatementPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationYourAppealStatementPage'),
);

Cypress.Commands.add(
  'confirmNavigationDecisionDateExpiredPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDateExpiredPage'),
);

Cypress.Commands.add(
  'confirmNavigationDecisionDateAbsentPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDateAbsentPage'),
);

Cypress.Commands.add(
  'confirmNavigationEnforcementNoticePage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationEnforcementNoticePage'),
);

Cypress.Commands.add(
  'confirmNavigationYourDetailsPage',
  require('../appellant-submission-your-details/confirmNavigationYourDetailsPage'),
);

Cypress.Commands.add(
  'confirmNavigationWhoAreYouPage',
  require('../appellant-submission-your-details/confirmNavigationWhoAreYouPage'),
);

Cypress.Commands.add(
  'confirmNavigationApplicantNamePage',
  require('../appellant-submission-your-details/confirmNavigationApplicantNamePage'),
);

Cypress.Commands.add(
  'confirmNavigationTaskListPage',
  require('../appellant-submission-your-details/confirmNavigationTaskListPage'),
);

Cypress.Commands.add(
  'confirmNavigationPlanningApplicationNumberPage',
  require('../appeal-navigation-confirmation/appellant-submission/confirmNavigationPlanningApplicationNumberPage'),
);

Cypress.Commands.add(
  'userIsNavigatedToPage',
  require('../appeal-navigation/userIsNavigatedToPage'),
);

Cypress.Commands.add(
  'goToSiteSafetyPage',
  require('../appeal-navigation/appellant-submission/goToSiteSafetyPage'),
);

Cypress.Commands.add(
  'clickCheckYourAnswers',
  require('../appeal-navigation/clickCheckYourAnswers'),
);

Cypress.Commands.add(
  'goToEnforcementNoticePage',
  require('../appeal-navigation/eligibility/goToEnforcementNoticePage'),
);

Cypress.Commands.add(
  'goToHouseholderQuestionPage',
  require('../appeal-navigation/eligibility/goToHouseholderQuestionPage'),
);

Cypress.Commands.add(
  'goToHouseholderQuestionOutPage',
  require('../appeal-navigation/eligibility/goToHouseholderQuestionOutPage'),
);

Cypress.Commands.add(
  'confirmNavigationAcpPage',
  require('../integration-with-acp/confirmNavigationAcpPage'),
);

Cypress.Commands.add(
  'confirmNavigationTermsAndConditionsPage',
  require('../appeal-navigation-confirmation/appellant-submission/confirmNavigationTermsAndConditionsPage'),
);
