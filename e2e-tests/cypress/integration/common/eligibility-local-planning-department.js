import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';

const UNKNOWN_DEPARTMENT = 'Anything. Whatever you want to type.';
let firstEligibleLocalPlanningDepartment = '';
let firstIneligibleLocalPlanningDepartment = '';

before(() => {
  cy.visit('/eligibility/planning-department');
  cy.get('[data-cy="eligible-departments"]').invoke('text').then((departments) => {
    const eligiblePlanningDepartments = departments.toString().split(',');
    if (eligiblePlanningDepartments.length > 0) {
      firstEligibleLocalPlanningDepartment = eligiblePlanningDepartments[0];
    }
  });
  cy.get('[data-cy="ineligible-departments"]').invoke('text').then((departments) => {
    const ineligiblePlanningDepartments = departments.toString().split(',');
    if (ineligiblePlanningDepartments.length > 0) {
      firstIneligibleLocalPlanningDepartment = ineligiblePlanningDepartments[0];
    }
  });
})

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
  'the user provides a Local Planning Department that is not participating in this service', () => {
    cy.provideLocalPlanningDepartment(firstIneligibleLocalPlanningDepartment);
    cy.clickSaveAndContinue();
  },
);

When('the user provides a Local Planning Department that is participating in this service', () => {
  cy.provideLocalPlanningDepartment(firstEligibleLocalPlanningDepartment);
  cy.clickSaveAndContinue();
});

Then(
  'the user is informed that the selected Local Planning Department is not participating in the service', () => {
    cy.confirmLocalPlanningDepartmentIsNotParticipating();
  },
);

Then(
  'the user is informed that a Local Planning Department in the provided list is required', () => {
    cy.confirmLocalPlanningDepartmentIsRequired();
  },
);

Then('the user can proceed with the provided Local Planning Department', () => {
  cy.confirmProviedLocalPlanningDepartmentWasAccepted();
});

Then('the user can proceed and the appeal is updated with the Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected(firstEligibleLocalPlanningDepartment);
});

Then('appeal is updated with the ineligible Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected(firstIneligibleLocalPlanningDepartment);
});

Then('appeal is not updated with the unknown Local Planning Department', () => {
  cy.confirmPlanningDepartmentSelected('');
});

Given('a prospective appellant is providing their Local Planning Department on the eligibility checker', () => {
  cy.goToPlanningDepartmentPage();
});

When('an ineligible Local Planning Department is provided', () => {
  cy.provideLocalPlanningDepartment(firstIneligibleLocalPlanningDepartment);
  cy.clickSaveAndContinue();
});

When('an eligible Local Planning Department is provided', () => {
  cy.provideLocalPlanningDepartment(firstEligibleLocalPlanningDepartment);
  cy.clickSaveAndContinue();
});

Then('the user is able to proceed through the eligibility checker', () => {
  cy.confirmNavigationListedBuildingPage()
})

Then('the user is not able to proceed through the eligibility checker', () => {
  cy.confirmNavigationLocalPlanningDepartmentPage()
})

And('taken to a page with the question "Is your appeal about a listed building?"', () => {
  cy.confirmTextOnPage('Is your appeal about a listed building?');
})

And('is routed to the page “This service is not available in your area”', () => {
  cy.confirmTextOnPage('This service is not available in your area');
})
