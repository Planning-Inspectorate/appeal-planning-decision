import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from './standard-appeal';

Given('an appeal exists', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.goToSubmissionPage();
});

When('the user confirms their answers', () => {
  cy.clickSaveAndContinue();
});

Then('the user should be presented with the Terms and Conditions of the service', () => {
  cy.confirmNavigationTermsAndConditionsPage();
});

When('the appeal confirmation is presented', () => {
  cy.agreeToTheDeclaration();
});

Then('the required link is displayed in the page body', () => {
  cy.confirmFeedbackLinkIsDisplayedInPageBody();
});
