import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

When('the user does not provide a Local Planning Department', () => {
  cy.provideLocalPlanningDepartment('');
});

Then('the user is informed that a Local Planning Department is required', () => {
  cy.confirmLocalPlanningDepartmentIsRequired();
});


When('the user provides a Local Planning Department that is not participating in this service', () => {
  cy.provideLocalPlanningDepartment('Anything. Whatever you want to type.');
});

Then('the user is informed that the selected Local Planning Department is not participating in the service', () => {
  cy.confirmLocalPlanningDepartmentIsNotParticipating();
});

Then('the user is directed to the Appeal a Planning Decision service', () => {
  cy.confirmRedirectToExternalService();
});

When('the user provides a Local Planning Department that is participating in this service', () => {
  cy.provideLocalPlanningDepartment('Adur LPA');
});

Then('the user can proceed with the provided Local Planning Department', () => {
  cy.confirmProviedLocalPlanningDepartmentWasAccepted();
});
