import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the "Application number" is presented', () => {
  cy.goToPlanningApplicationNumberPage();
});

Given('the "Upload application" is presented', () => {
  cy.goToPlanningApplicationSubmission();
});

Given('the "Upload decision letter" is presented', () => {
  cy.goToDecisionLetterPage();
});

When('the "Application number" is submitted with valid values', () => {
  const planningApplicationNumber = 'ValidNumber/12345';

  cy.get('[data-cy="application-number"]').type(
    `{selectall}{backspace}${planningApplicationNumber}`,
  );
  cy.wait(Cypress.env('demoDelay'));
  cy.get('[data-cy="button-save-and-continue"]').click();
  cy.wait(Cypress.env('demoDelay'));
});

When('the "Upload application" is submitted with valid values', () => {
  cy.uploadPlanningApplicationFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();
});

When('the "Upload decision letter" is submitted with valid values', () => {
  cy.uploadDecisionLetterFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();
});
