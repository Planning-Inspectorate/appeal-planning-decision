import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the "Appeal statement" is presented', () => {
  cy.goToAppealStatementSubmission();
});

Given('the "Supporting documents" is presented', () => {
  cy.goToSupportingDocumentsPage();
});

When('the "Appeal statement" is submitted with valid values', () => {
  cy.checkNoSensitiveInformation();
  cy.uploadAppealStatementFile('appeal-statement-valid.pdf');
  cy.clickSaveAndContinue();
});

When('the "Supporting documents" is submitted with valid values', () => {
  cy.uploadSupportingDocuments('appeal-statement-valid.pdf');
  cy.clickSaveAndContinue();
});
