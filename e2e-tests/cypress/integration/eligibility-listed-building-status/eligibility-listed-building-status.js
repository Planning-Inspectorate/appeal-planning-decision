import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

When('the prospective appellant does not provide a Listed Building statement', () => {
  cy.provideNoListedBuildingStatement();
});

Then('the prospective appellant is informed that a Listed Building statement is required', () => {
  cy.confirmListedBuildingStatementIsRequired();
});


When('the prospective appellant states that their case concerns a Listed Building', () => {
  cy.stateCaseInvolvesListedBuilding();
});

Then('the prospective appellant is informed that cases concerning a Listed Building cannot be processed via this service', () => {
  cy.confirmListedBuildingsCannotProceed();
});

Then('the prospective appellant is directed to the Appeal a Planning Decision service', () => {
  cy.confirmRedirectToExternalService();
});

When('the prospective appellant states that their case does not concern a Listed Building', () => {
  cy.stateCaseDoesNotInvolveAListedBuilding();
});

Then('the prospective appellant can proceed with a non-Listed Building', () => {
  cy.confirmUserCanProceedWithNonListedBuilding();
});
