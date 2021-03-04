// These commands are intended for simple page navigation by url

// Eligibility

Cypress.Commands.add('goToStartAppealPage', require('./go-to-page/goToStartAppealPage'));
Cypress.Commands.add('goToHouseholderQuestionPage', require('./go-to-page/goToHouseholderQuestionPage'));
Cypress.Commands.add('goToHouseholderQuestionOutPage', require('./go-to-page/goToHouseholderQuestionOutPage'));
Cypress.Commands.add('goToDecisionDatePage', require('./go-to-page/goToDecisionDatePage'));
Cypress.Commands.add('goToDecisionDateExpiredPage', require('./go-to-page/goToDecisionDateExpiredPage'));
Cypress.Commands.add('goToNoDecisionDatePage', require('./go-to-page/goToNoDecisionDatePage'));
Cypress.Commands.add('goToPlanningDepartmentPage', require('./go-to-page/goToPlanningDepartmentPage'));
Cypress.Commands.add('goToPlanningDepartmentOutPage', require('./go-to-page/goToPlanningDepartmentOutPage'));
Cypress.Commands.add('goToEnforcementNoticePage', require('./go-to-page/goToEnforcementNoticePage'));
Cypress.Commands.add('goToListedBuildingPage', require('./go-to-page/goToListedBuildingPage'));
Cypress.Commands.add('goToListedBuildingOutPage', require('./go-to-page/goToListedBuildingOutPage'));
Cypress.Commands.add('goToCostsPage', require('./go-to-page/goToCostsPage'));
Cypress.Commands.add('goToAppealStatementInfoPage', require('./go-to-page/goToAppealStatementInfoPage'));

// Appellant Submission

Cypress.Commands.add('goToTaskListPage', require('./go-to-page/goToTaskListPage'));
Cypress.Commands.add('goToWhoAreYouPage', require('./go-to-page/goToWhoAreYouPage'));
Cypress.Commands.add('goToYourDetailsPage', require('./go-to-page/goToYourDetailsPage'));
Cypress.Commands.add('goToApplicantNamePage', require('./go-to-page/goToApplicantNamePage'));
Cypress.Commands.add('goToPlanningApplicationNumberPage', require('./go-to-page/goToPlanningApplicationNumberPage'));
Cypress.Commands.add('goToPlanningApplicationSubmission', require('./go-to-page/goToPlanningApplicationSubmission'));
Cypress.Commands.add('goToDecisionLetterPage', require('./go-to-page/goToDecisionLetterPage'));
Cypress.Commands.add('goToAppealStatementSubmission', require('./go-to-page/goToAppealStatementSubmission'));
Cypress.Commands.add('goToSupportingDocumentsPage', require('./go-to-page/goToSupportingDocumentsPage'));
Cypress.Commands.add('goToSiteAddressPage', require('./go-to-page/goToSiteAddressPage'));
Cypress.Commands.add('goToWholeSiteOwnerPage', require('./go-to-page/goToWholeSiteOwnerPage'));
Cypress.Commands.add('goToOtherSiteOwnerToldPage', require('./go-to-page/goToOtherSiteOwnerToldPage'));
Cypress.Commands.add('goToAccessSitePage', require('./go-to-page/goToAccessSitePage'));
Cypress.Commands.add('goToHealthAndSafetyPage', require('./go-to-page/goToHealthAndSafetyPage'));
Cypress.Commands.add('goToCheckYourAnswersPage', require('./go-to-page/goToCheckYourAnswersPage'));
Cypress.Commands.add('goToSubmissionPage', require('./go-to-page/goToSubmissionPage'));

// ACP Integration

Cypress.Commands.add('goToPageNotFoundPage', require('./go-to-page/goToPageNotFoundPage'));

// Common

Cypress.Commands.add('goToLandingPage', require('./go-to-page/goToLandingPage'));
Cypress.Commands.add('goToCookiePreferencesPage', require('./go-to-page/goToCookiePreferences'));


// Guidance Pages

Cypress.Commands.add('goToPageBeforeYouAppeal', require('./go-to-page/goToPageBeforeYouAppeal'));
