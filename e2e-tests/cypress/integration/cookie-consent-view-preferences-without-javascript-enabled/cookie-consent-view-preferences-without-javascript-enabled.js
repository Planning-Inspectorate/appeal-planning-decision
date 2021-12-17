import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user has elected to manage their cookie preference without JavaScript enabled', () => {
  cy.goToHouseholderQuestionPage({ script: false });
});

When('the user views the Cookie Preferences service page', () => {
  cy.visit('/cookies', { script: false });
});

Then('the page content will mention about cookies requiring Javascript to be turned on', () => {
  cy.userIsNavigatedToPage('cookie');

  cy.confirmGenericPageContentExists();
  cy.confirmPageHeadingWithoutJavaScriptEnabled();
  cy.confirmBodyContentWithoutJavaScriptEnabled();
});
