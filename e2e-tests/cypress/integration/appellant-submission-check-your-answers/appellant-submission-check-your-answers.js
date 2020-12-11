import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user is presented with the answers they had provided', () => {
  cy.goToCheckYourAnswersPage();
});

When('the user confirms that they are happy with their answers', () => {
  cy.saveAndContinue();
});

When('the user checks their answers', () => {});

Then('the user should be presented with the Terms and Conditions of the service', () => {
  cy.confirmSubmissionPage();
});
