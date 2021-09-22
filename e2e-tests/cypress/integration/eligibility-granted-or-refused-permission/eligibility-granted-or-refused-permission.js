import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

Given('Householder Planning Permission Status is requested', () => {
    cy.goToGrantedOrRefusedPermissionPage();
})

When('Householder Planning Permission Status is set to Refused', () => {
    cy.provideHouseholderPlanningPermissionStatusRefused();
    cy.clickSaveAndContinue();
})

Then('progress is made to the eligibility Decision Date question', () => {
    cy.confirmNavigationDecisionDatePage();
})

When('Householder Planning Permission Status is set to Granted', () => {
  cy.provideHouseholderPlanningPermissionStatusGranted();
  cy.clickSaveAndContinue();
})

Then('User is navigated to kick-out page', () => {
  cy.confirmNavigationGrantedRefusedKickoutPage();
  cy.validateBackLinkIsNotAvailable();
})

When('Householder Planning Permission Status is set to I have not received a decision', () => {
  cy.provideHouseholderPlanningPermissionStatusNoDecision();
  cy.clickSaveAndContinue();
})

Then('User is navigated to no-decision page', () => {
  cy.confirmNavigationNoDecisionDatePage();
  cy.validateBackLinkIsNotAvailable();
})

When('No Householder Planning Permission Status is not selected', () => {
    cy.clickSaveAndContinue();
})

Then('Progress is halted with a message that a Householder Planning Permission Status is required', () => {
  cy.title().should('include', 'Error: ');
  cy.confirmNavigationGrantedOrRefusedPermissionPage();
  cy.confirmTextOnPage('Select if your planning permission was granted or refused, or if you have not received a decision');
  // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  cy.checkPageA11y({
    exclude: ['.govuk-radios__input'],
  });
})
