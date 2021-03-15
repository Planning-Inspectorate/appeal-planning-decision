import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('user has not previously provided a planning application number', () => {
  cy.goToPlanningApplicationNumberPage();
});

Given('user has previously provided a planning application number {string}', (valid_number) => {
  cy.providePlanningApplicationNumber(valid_number);
});

Given('the user is prompted to provide a planning application number', () => {
    cy.goToPlanningApplicationNumberPage();
});

When('the user provides a planning application number {string}', (valid_number) => {
  cy.providePlanningApplicationNumber(valid_number);
});

Then('the planning application number in the appeal will be {string}', (applicationNumber) => {
  cy.confirmPlanningApplicationNumberHasUpdated(applicationNumber);
});

Then('the user is informed that the application number is not valid because {string}', (reason) => {
  switch (reason) {
    case 'mandatory field':
      cy.confirmPlanningApplicationNumberRejectedBecause('Enter your planning application number');
      break;
    case 'exceeds max characters':
      cy.confirmPlanningApplicationNumberRejectedBecause('Planning application number must be 30 characters or fewer');
      break;
    default:
      throw new Error(`test fails here because it could not find the reason [${reason}] in the list of cases`)
  }
});

Then('the appeal is not updated with the provided planning application number', () => {
  cy.confirmPlanningApplicationNumberHasNotUpdated();
});
