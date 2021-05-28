import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const disableJs = true;

Given('a user has elected to manage their cookie preference without JavaScript enabled', () => {
  cy.goToTaskListPage();
});

When('the user views the Cookie Preferences service page', () => {
  cy.goToPage('/cookies', undefined, disableJs);
});

Then('the page content will mention about cookies requiring Javascript to be turned on', () => {
  cy.visit('/cookies', { script: false });

  cy.confirmGenericPageContentExists();
  cy.confirmPageHeadingWithoutJavaScriptEnabled();
  cy.confirmBodyContentWithoutJavaScriptEnabled();
});
