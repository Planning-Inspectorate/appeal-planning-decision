import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('an appeal is being made', () => {});

When('the {string} page is presented', (page) => {
  switch (page) {
    case 'Eligibility - Start appeal':
      cy.goToStartAppealPage();
      break;
    case 'Eligibility - Decision date':
      cy.goToDecisionDatePage();
      break;
    case 'Eligibility - Decision date expired':
      cy.goToDecisionDateExpiredPage();
      break;
    case 'Eligibility - No decision date':
      cy.goToNoDecisionDatePage();
      break;
    case 'Eligibility - Planning department':
      cy.goToPlanningDepartmentPage();
      break;
    case 'Eligibility - Planning department out':
      cy.goToPlanningDepartmentOutPage();
      break;
    case 'Eligibility - Listed building':
      cy.goToListedBuildingPage();
      break;
    case 'Eligibility - Listed building out':
      cy.goToListedBuildingOutPage();
      break;
    case 'Eligibility - Appeal statement info':
      cy.goToAppealStatementInfoPage();
      break;
    case 'Appellant submission - Appeal tasks':
      cy.goToTaskListPage();
      break;
    case 'Appellant submission - Your details - Who are you':
      cy.goToWhoAreYouPage();
      break;
    case 'Appellant submission - Your details - Your details':
      cy.goToYourDetailsPage();
      break;
    case 'Appellant submission - Your details - Applicant name':
      cy.goToApplicantNamePage();
      break;
    case 'Appellant submission - Planning application - Application number':
      cy.promptUserToProvidePlanningApplicationNumber();
      break;
    case 'Appellant submission - Planning application - Upload application':
      cy.goToPlanningApplicationSubmission();
      break;
    case 'Appellant submission - Planning application - Upload decision letter':
      cy.goToDecisionLetterPage();
      break;
    case 'Appellant submission - Your appeal - Appeal statement':
      cy.goToAppealStatementSubmission();
      break;
    case 'Appellant submission - Your appeal - Supporting documents':
      cy.goToSupportingDocumentsPage();
      break;
    case 'Appellant submission - Appeal site - Site location':
      cy.goToSiteAddressPage();
      break;
    case 'Appellant submission - Appeal site - Site ownership':
      cy.goToWholeSiteOwnerPage();
      break;
    case 'Appellant submission - Appeal site - Site ownership certb':
      cy.goToOtherSiteOwnerToldPage();
      break;
    case 'Appellant submission - Appeal site - Site access':
      cy.goToAccessSitePage();
      break;
    case 'Appellant submission - Appeal site - Site safety':
      cy.goToHealthAndSafetyPage();
      break;
    case 'Appellant submission - Appeal answers':
      cy.goToCheckYourAnswersPage();
      break;
    case 'Appeal submission':
      cy.goToSubmissionPage();
      break;
    default:
      throw new Error('This page is unknown = ' + page);
  }
});

Then('the required links are displayed', () => {
  cy.confirmTermsAndConditionsLinkDisplayed();
  cy.confirmPrivacyLinkDisplayed();
  cy.confirmCookiesLinkDisplayed();
  cy.confirmAccessibilityLinkDisplayed();
});

Then('the required header link is displayed', () => {
  cy.confirmFeedbackLinkIsDisplayed();
});

Then('the required GA script is present', () => {
  cy.confirmGoogleAnalyticsLinkIsPresent();
});

Then('the back button is displayed', () => {
  cy.confirmBackButtonDisplayed();
});

Then('the back button is not displayed', () => {
  cy.confirmBackButtonNotDisplayed();
});
