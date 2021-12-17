import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user checks the status of their appeal', () => {
  cy.goToTaskListPage();
});

When('the user selects to provide their planning application number', () => {
  cy.goToPlanningApplicationNumberPage();
});

Then('the user should be presented with opportunity to provide their planning application number', () => {
  cy.confirmUserPresentedWithProvidePlanningApplicationNumber();
});
