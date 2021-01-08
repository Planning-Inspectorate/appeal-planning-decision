import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const ELIGIBLE_DEPARTMENT = 'Adur LPA';
const INELIGIBLE_DEPARTMENT = 'Ashford LPA';
const UNKNOWN_DEPARTMENT = 'Anything. Whatever you want to type.';

Given('the list of Local Planning Department is presented', () => {
  cy.goToPlanningDepartmentPage();
});

When('the user does not provide a Local Planning Department', () => {
  cy.provideLocalPlanningDepartment('');
  cy.clickSaveAndContinue();
});

When('the user provides a Local Planning Department not in the provided list', () => {
  cy.provideLocalPlanningDepartment(UNKNOWN_DEPARTMENT);
  cy.clickSaveAndContinue();
});

When(
  'the user provides a Local Planning Department that is not participating in this service',
  () => {
    cy.provideLocalPlanningDepartment(INELIGIBLE_DEPARTMENT);
    cy.clickSaveAndContinue();
  },
);

When('the user provides a Local Planning Department that is participating in this service', () => {
  cy.provideLocalPlanningDepartment(ELIGIBLE_DEPARTMENT);
  cy.clickSaveAndContinue();
});

Then(
  'the user is informed that the selected Local Planning Department is not participating in the service',
  () => {
    cy.confirmLocalPlanningDepartmentIsNotParticipating();
  },
);

Then(
  'the user is informed that a Local Planning Department in the provided list is required',
  () => {
    cy.confirmLocalPlanningDepartmentIsRequired();
  },
);

Then('the user can proceed with the provided Local Planning Department', () => {
  cy.confirmProviedLocalPlanningDepartmentWasAccepted();
});

Then('the user can proceed and the appeal is updated with the Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected(ELIGIBLE_DEPARTMENT);
});

Then('appeal is updated with the ineligible Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected(INELIGIBLE_DEPARTMENT);
});

Then('appeal is not updated with the unknown Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected('');
});
