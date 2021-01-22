import moment from "moment";
import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

const dateForXDaysAgo = (x) => {
  const now = moment();
  const then = now.subtract(x, 'days');

  return {
    day: then.format('DD'),
    month: then.format('MM'),
    year: then.format('YYYY'),
  };
}

Given('the application decision date is requested', () => {
  cy.goToDecisionDatePage();
})

When('a decision date is provided that is no more than 12 weeks old', () => {
  const aGoodDate = dateForXDaysAgo(84);
  cy.provideDecisionDate(aGoodDate);
})

Then('the appeal can be commenced', () => {
  cy.confirmNavigationAcpPage();
})

When('a decision date is provided that is more than 12 weeks old', () => {
  const aBadDate = dateForXDaysAgo(85);
  cy.provideDecisionDate(aBadDate);
})

Then('the decision date is highlighted as beyond the deadline for appeal', () => {
  cy.confirmProvidedDecisionDateWasRejected();
})

When('an invalid decision date {string}-{string}-{string} is provided', (day, month, year) => {
  cy.provideDecisionDate({day, month, year});
})

Then('the decision date is highlighted as invalid', () => {
  cy.confirmProvidedDecisionDateWasInvalid();
})

When('an attempt is made to access {string}', (page) => {
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
})

Then('the {string} is accessed', (page) => {
  switch (page) {
    case 'Eligibility - Decision date':
      cy.confirmNavigationDecisionDatePage();
      break;
    case 'Eligibility - Decision date expired':
      cy.confirmNavigationDecisionDateExpiredPage();
      break;
    case 'Eligibility - No decision date':
      cy.confirmNavigationNoDecisionDatePage();
      break;
    default:
      throw new Error('This page is unknown = ' + page);
  }
})

Then('the page is not accessed because the page is not found', () => {
  cy.confirmNavigationPageNotFoundPage();
})
