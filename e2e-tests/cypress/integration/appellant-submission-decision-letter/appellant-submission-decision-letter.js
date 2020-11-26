import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('user has previously submitted a decision letter file {string}', (filename) => {
  cy.goToAppellantSubmissionDecisionLetter();
  cy.uploadDecisionLetterFile(filename);
  cy.saveAndContinue();
});

When('user submits a decision letter file {string}', (filename) => {
  cy.goToAppellantSubmissionDecisionLetter();
  cy.uploadDecisionLetterFile(filename);
  cy.saveAndContinue();
});

Then('user can see that the decision letter file {string} {string} submitted', (filename, submitted) => {
  if (submitted === 'is') {
    cy.confirmDecisionLetterFileIsUploaded(filename);
  } else {
    cy.confirmDecisionLetterFileIsNotUploaded();
  }
});

Then('user is informed that the file is not submitted because {string}', (reason) => {
  switch (reason) {
    case 'file type is invalid':
      cy.confirmFileInvalidBecauseWrongFileType();
      break;
    case 'file size exceeds limit':
      cy.confirmFileInvalidBecauseExceedsSizeLimit();
      break;
  }
});
