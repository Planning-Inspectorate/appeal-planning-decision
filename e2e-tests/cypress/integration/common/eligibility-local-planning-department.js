import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';

Given('the list of Local Planning Department is presented', () => {
  cy.goToPlanningDepartmentPage();
});

When('the user does not provide a Local Planning Department', () => {
  cy.provideLocalPlanningDepartment('');
  cy.clickSaveAndContinue();
});

When('the user provides a Local Planning Department not in the provided list', () => {
  cy.provideLocalPlanningDepartment('An unknown LPA');
  cy.clickSaveAndContinue();
});

When('the user provides a Local Planning Department that is not participating in this service', () => {
    cy.provideIneligibleLocalPlanningDepartment();
    cy.clickSaveAndContinue();
  }
);

When('the user provides a Local Planning Department that is participating in this service', () => {
  cy.provideEligibleLocalPlanningDepartment();
  cy.clickSaveAndContinue();
});

Then(
  'the user is informed that the selected Local Planning Department is not participating in the service', () => {
    cy.confirmLocalPlanningDepartmentIsNotParticipating();
  },
);

Then('the user is informed that a Local Planning Department in the provided list is required', () => {
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

Then('appeal is updated with the ineligible Local Planning Department', () => {
  cy.goToPlanningDepartmentPage();
  cy.confirmIneligibleLocalPlanningDepartment();
});

Then('appeal is not updated with the unknown Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected('');
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

And('the next eligibility question is asked i.e. "Is your appeal about a listed building?"', () => {
  cy.confirmNavigationListedBuildingPage()
  cy.confirmTextOnPage('Is your appeal about a listed building?');
})

And('progress is halted with the message “This service is not available in your area”', () => {
  cy.confirmNavigationLocalPlanningDepartmentPage()
  cy.confirmTextOnPage('This service is not available in your area');
})
