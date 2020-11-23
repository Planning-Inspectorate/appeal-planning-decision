import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

When('the prospective appellant does not provide a Local Planning Department', () => {
  cy.provideLocalPlanningDepartment('');
});

Then('the prospective appellant is informed that a Local Planning Department is required', () => {
  cy.confirmLocalPlanningDepartmentIsRequired();
});


When('the prospective appellant provides a Local Planning Department that is not participating in this service', () => {
  cy.provideLocalPlanningDepartment('Anything. Whatever you want to type.');
});

Then('the prospective appellant is informed that the selected Local Planning Department is not participating in the service', () => {
  cy.confirmLocalPlanningDepartmentIsNotParticipating();
});

Then('the prospective appellant is directed to the Appeal a Planning Decision service', () => {
  cy.confirmRedirectToExternalService();
});

When('the prospective appellant provides a Local Planning Department that is participating in this service', () => {
  cy.provideLocalPlanningDepartment('Adur LPA');
});

Then('the prospective appellant can proceed with the provided Local Planning Department', () => {
  cy.confirmProviedLocalPlanningDepartmentWasAccepted();
});
