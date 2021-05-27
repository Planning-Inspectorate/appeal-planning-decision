import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the list of Local Planning Department is presented', () => {
  cy.goToPlanningDepartmentPage();
});

Given('the user can select from a list of Local Planning Departments', () => {
  cy.goToPlanningDepartmentPageWithoutJs();
});

When('the user does not provide a Local Planning Department', () => {
  cy.provideLocalPlanningDepartment('');
  cy.clickSaveAndContinue();
});

When('the user does not select a Local Planning Department', () => {
  cy.clickSaveAndContinue();
});

When('the user provides a Local Planning Department not in the provided list', () => {
  cy.provideLocalPlanningDepartment('An unknown LPA');
  cy.clickSaveAndContinue();
});

When('the user selects the empty value from the list of Local Planning Departments', () => {
  cy.selectLocalPlanningDepartmentWithoutJs('');
  cy.clickSaveAndContinue();
});

When(
  'the user provides a Local Planning Department that is not participating in this service',
  () => {
    cy.provideIneligibleLocalPlanningDepartment();
    cy.clickSaveAndContinue();
  },
);

When(
  'the user selects a Local Planning Department that is not participating in this service',
  () => {
    cy.selectIneligibleLocalPlanningDepartmentWithoutJs();
    cy.clickSaveAndContinue();
  },
);

When('the user provides a Local Planning Department that is participating in this service', () => {
  cy.provideEligibleLocalPlanningDepartment();
  cy.clickSaveAndContinue();
});

When('the user selects a Local Planning Department that is participating in this service', () => {
  cy.selectEligibleLocalPlanningDepartmentWithoutJs();
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

Then(
  'the user is informed that a Local Planning Department in the provided list must be selected',
  () => {
    cy.confirmLocalPlanningDepartmentIsRequired();
  },
);

Then('the user can proceed with the provided Local Planning Department', () => {
  cy.confirmProviedLocalPlanningDepartmentWasAccepted();
});

Then('the user can proceed and the appeal is updated with the Local Planning Department', () => {
  cy.goToPlanningDepartmentPage();
  cy.confirmEligibleLocalPlanningDepartment();
});

Then(
  'the user can proceed and the appeal is updated with the selected Local Planning Department',
  () => {
    cy.goToPlanningDepartmentPageWithoutJs();
    cy.confirmEligibleLocalPlanningDepartmentWithoutJs();
  },
);

Then('appeal is updated with the ineligible Local Planning Department', () => {
  cy.goToPlanningDepartmentPage();
  cy.confirmIneligibleLocalPlanningDepartment();
});

Then('appeal is not updated with the unknown Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected('');
});

Then('appeal Local Planning Department is not updated with the empty value', () => {
  cy.confirmPlanningDepartmentSelectedWithoutJs('');
});

Given('LPD is requested', () => {
  cy.goToPlanningDepartmentPage();
});

When('an ineligible LPD is provided', () => {
  cy.provideIneligibleLocalPlanningDepartment();
  cy.clickSaveAndContinue();
});

When('an eligible LPD is provided', () => {
  cy.provideEligibleLocalPlanningDepartment();
  cy.clickSaveAndContinue();
});

And('the user can proceed to the Enforcement Notice eligibility check', () => {
  cy.confirmNavigationEnforcementNoticePage();
  cy.confirmTextOnPage('Have you received an enforcement notice?');
});

And('progress is halted with the message “This service is not available in your area”', () => {
  const heading = 'This service is not available in your area';
  cy.confirmNavigationLocalPlanningDepartmentPage();
  cy.title().should('contain', heading);
  cy.confirmTextOnPage(heading);
});
