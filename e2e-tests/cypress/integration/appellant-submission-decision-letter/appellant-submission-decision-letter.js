import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('user submits a decision letter file {string}', (filename) => {
  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile(filename);
});

Given('user does not submits a decision letter file', () => {
  cy.goToDecisionLetterPage();
});

Given('user has previously submitted a decision letter file {string}', (filename) => {
  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile(filename);
  cy.saveAndContinue();
});

When('The application file {string} is submitted and user can proceed', (filename) => {
  cy.saveAndContinue();
  cy.confirmDecisionLetterAccepted(filename);
});

Then('user can see that no decision letter file is submitted', (reason) => {
  cy.saveAndContinue();
  cy.confirmDecisionLetterRejectedBecause('Upload the decision letter');
});

Then('user can see that the decision letter file {string} "is" submitted', (filename) => {
  cy.saveAndContinue();
  cy.confirmDecisionLetterAccepted(filename);
});

Then(
  'user is informed that the decision letter file is not submitted because {string}',
  (reason) => {
    cy.saveAndContinue();

    switch (reason) {
      case 'file type is invalid':
        cy.confirmDecisionLetterRejectedBecause('Doc is the wrong file type');
        break;
      case 'file size exceeds limit':
        cy.confirmDecisionLetterRejectedBecause('The file must be smaller than');
        break;
    }
  },
);
