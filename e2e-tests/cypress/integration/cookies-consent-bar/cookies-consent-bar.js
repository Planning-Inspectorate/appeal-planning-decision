import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user visits the site with JavaScript disabled', () => {
  cy.visit('/', { script: false });
});

When('the user navigates through the service', () => {
  cy.provideHouseholderAnswerYes();
  cy.clickSaveAndContinue();
  cy.confirmNavigationDecisionDatePage();
});

When('the user views the cookie preferences page', () => {
  cy.goToHelpCookiesPage();
});

Then('the cookies page is presented', () => {
  cy.userIsNavigatedToPage('/help/cookies');
});
