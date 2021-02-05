import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

When('the user does not provide a Listed Building statement', () => {
  cy.provideNoListedBuildingStatement();
});

Then('the user is informed that a Listed Building statement is required', () => {
  cy.confirmListedBuildingStatementIsRequired();
});

When('the user states that their case concerns a Listed Building', () => {
  cy.stateCaseInvolvesListedBuilding();
});

Then(
  'the user is informed that cases concerning a Listed Building cannot be processed via this service',
  () => {
    cy.confirmListedBuildingsCannotProceed();
  },
);

Then('the user is directed to the Appeal a Planning Decision service', () => {
  cy.confirmRedirectToExternalService();
});

When('the user states that their case does not concern a Listed Building', () => {
  cy.stateCaseDoesNotInvolveAListedBuilding();
});

Then('the user can proceed to the claiming Costs eligibility check', () => {
  cy.confirmUserCanProceedWithNonListedBuilding();
});
