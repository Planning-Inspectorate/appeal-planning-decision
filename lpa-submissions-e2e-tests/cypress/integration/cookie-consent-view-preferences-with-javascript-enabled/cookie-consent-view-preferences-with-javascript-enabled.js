import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user has elected to manage their cookie preference', () => {
  cy.goToTaskListPage();
});

When('the user views the Cookie Preferences service', () => {
  cy.goToCookiePreferencesPage();
});

Then('the user is provided information of what task each cookie is performing', () => {
  cy.goToCookiePage('/cookie');

  cy.confirmGenericPageContentExists();
  cy.confirmPageHeadingWithJavaScriptEnabled();
  cy.confirmBodyContentWithJavaScriptEnabled();
});
