import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user is prompted to provide a planning application number', () => {
    cy.promptUserToProvidePlanningApplicationNumber();
});

When('the user provides a planning application number {string}', (valid_number) => {
  cy.providePlanningApplicationNumber(valid_number);
});

Then('the appeal is updated with the provided planning application number', () => {
  cy.confirmPlanningApplicationNumberHasUpdated();
});

Then('the user is informed that the application number is not valid because {string}', (reason) => {
  switch (reason) {
    case 'mandatory field':
      cy.confirmPlanningApplicationNumberRejectedBecause('Enter your planning application number');
      break;
  }
});

Then('the appeal is not updated with the provided planning application number', () => {
  cy.confirmPlanningApplicationNumberHasNotUpdated();
});
