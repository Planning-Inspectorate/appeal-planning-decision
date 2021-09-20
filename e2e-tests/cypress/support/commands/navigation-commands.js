// These commands are intended for simple page navigation by url

// Eligibility

Cypress.Commands.add('goToStartAppealPage', require('../go-to-page/goToStartAppealPage'));
Cypress.Commands.add(
  'goToHouseholderQuestionPage',
  require('../go-to-page/goToHouseholderQuestionPage'),
);
Cypress.Commands.add(
  'goToHouseholderQuestionOutPage',
  require('../go-to-page/goToHouseholderQuestionOutPage'),
);
Cypress.Commands.add('goToGrantedOrRefusedPermissionPage', require('../go-to-page/goToGrantedOrRefusedPermissionPage'));
Cypress.Commands.add('goToGrantedOrRefusedPermissionOutPage', require('../go-to-page/goToGrantedOrRefusedPermissionOutPage'));
Cypress.Commands.add('goToDecisionDatePage', require('../go-to-page/goToDecisionDatePage'));
Cypress.Commands.add(
  'goToDecisionDateExpiredPage',
  require('../go-to-page/goToDecisionDateExpiredPage'),
);
Cypress.Commands.add('goToNoDecisionDatePage', require('../go-to-page/goToNoDecisionDatePage'));
Cypress.Commands.add(
  'goToPlanningDepartmentPage',
  require('../go-to-page/goToPlanningDepartmentPage'),
);
Cypress.Commands.add(
  'goToPlanningDepartmentPageWithoutJs',
  require('../go-to-page/goToPlanningDepartmentPageWithoutJs'),
);
Cypress.Commands.add(
  'goToPlanningDepartmentOutPage',
  require('../go-to-page/goToPlanningDepartmentOutPage'),
);
Cypress.Commands.add(
  'goToEnforcementNoticePage',
  require('../go-to-page/goToEnforcementNoticePage'),
);
Cypress.Commands.add(
  'goToEnforcementNoticeOutPage',
  require('../go-to-page/goToEnforcementNoticeOutPage'),
);
Cypress.Commands.add('goToListedBuildingPage', require('../go-to-page/goToListedBuildingPage'));
Cypress.Commands.add(
  'goToListedBuildingOutPage',
  require('../go-to-page/goToListedBuildingOutPage'),
);
Cypress.Commands.add('goToCostsPage', require('../go-to-page/goToCostsPage'));
Cypress.Commands.add(
  'goToAppealStatementInfoPage',
  require('../go-to-page/goToAppealStatementInfoPage'),
);

// Appellant Submission

Cypress.Commands.add('goToTaskListPage', require('../go-to-page/goToTaskListPage'));
Cypress.Commands.add('goToWhoAreYouPage', require('../go-to-page/goToWhoAreYouPage'));
Cypress.Commands.add('goToYourDetailsPage', require('../go-to-page/goToYourDetailsPage'));
Cypress.Commands.add('goToApplicantNamePage', require('../go-to-page/goToApplicantNamePage'));
Cypress.Commands.add(
  'goToPlanningApplicationNumberPage',
  require('../go-to-page/goToPlanningApplicationNumberPage'),
);
Cypress.Commands.add(
  'goToPlanningApplicationSubmission',
  require('../go-to-page/goToPlanningApplicationSubmission'),
);
Cypress.Commands.add('goToDecisionLetterPage', require('../go-to-page/goToDecisionLetterPage'));
Cypress.Commands.add(
  'goToAppealStatementSubmission',
  require('../go-to-page/goToAppealStatementSubmission'),
);
Cypress.Commands.add(
  'goToSupportingDocumentsPage',
  require('../go-to-page/goToSupportingDocumentsPage'),
);
Cypress.Commands.add('goToSiteAddressPage', require('../go-to-page/goToSiteAddressPage'));
Cypress.Commands.add('goToWholeSiteOwnerPage', require('../go-to-page/goToWholeSiteOwnerPage'));
Cypress.Commands.add(
  'goToOtherSiteOwnerToldPage',
  require('../go-to-page/goToOtherSiteOwnerToldPage'),
);
Cypress.Commands.add('goToAccessSitePage', require('../go-to-page/goToAccessSitePage'));
Cypress.Commands.add('goToHealthAndSafetyPage', require('../go-to-page/goToHealthAndSafetyPage'));
Cypress.Commands.add('goToCheckYourAnswersPage', require('../go-to-page/goToCheckYourAnswersPage'));
Cypress.Commands.add('goToSubmissionPage', require('../go-to-page/goToSubmissionPage'));
Cypress.Commands.add(
  'goToSubmissionInformationPage',
  require('../go-to-page/goToSubmissionInformationPage')
);
Cypress.Commands.add('goToConfirmationPage', require('../go-to-page/goToConfirmationPage'));

Cypress.Commands.add('goToPageNotFoundPage', require('../go-to-page/goToPageNotFoundPage'));

// Common
Cypress.Commands.add('clickSaveAndContinue', require('../appeal-navigation/clickSaveAndContinue'));
Cypress.Commands.add('goToLandingPage', require('../go-to-page/goToLandingPage'));
Cypress.Commands.add('goToCookiePreferencesPage', require('../go-to-page/goToCookiePreferences'));

// Confirmation

Cypress.Commands.add(
  'confirmNavigationTermsAndConditionsPage',
  require('../appeal-navigation-confirmation/appellant-submission/confirmNavigationTermsAndConditionsPage'),
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
  'confirmNavigationGrantedOrRefusedPermissionPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationGrantedOrRefusedPermissionPage'),
);

Cypress.Commands.add(
  'confirmNavigationDecisionDatePage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDatePage'),
);

Cypress.Commands.add(
  'confirmNavigationGrantedRefusedKickoutPage',
  require('../appeal-navigation-confirmation/eligibility/confirmNavigationGrantedRefusedKickoutPage')
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
  'confirmSubmissionInformationDisplayItems',
  require('../appeal-submission-information/confirmSubmissionInformationDisplayItems'),
);
