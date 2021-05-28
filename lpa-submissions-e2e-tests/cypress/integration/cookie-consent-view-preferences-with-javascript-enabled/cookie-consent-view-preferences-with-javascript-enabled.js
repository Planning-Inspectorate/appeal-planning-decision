import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const disableJs = false;

Given('a user has elected to manage their cookie preference', () => {
  cy.goToTaskListPage();
});

When('the user views the Cookie Preferences service', () => {
  cy.goToPage('/cookies', undefined, disableJs);
});

Then('the user is provided information of what task each cookie is performing', () => {
  cy.visit('/cookies');

  cy.confirmGenericPageContentExists();
  cy.confirmPageHeadingWithJavaScriptEnabled();
  cy.confirmBodyContentWithJavaScriptEnabled();
});
