import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user has elected to manage their cookie preference', () => {
  cy.goToHouseholderQuestionPage();
});

When('the user views the Cookie Preferences service', () => {
  cy.goToCookiePreferencesPage();
});

Then('the user is provided information of what task each cookie is performing', () => {
  cy.userIsNavigatedToPage('cookie');

  cy.confirmGenericPageContentExists();
  cy.confirmPageHeadingWithJavaScriptEnabled();
  cy.confirmBodyContentWithJavaScriptEnabled();
});
