import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';


Given('user did not previously submitted a decision letter file',() => {})

Given('user has previously submitted a decision letter file {string}', (filename) => {
  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile(filename);
  cy.clickSaveAndContinue();
});

Given(
  'user has previously submitted a valid decision letter file {string} followed by an invalid file {string} that was rejected because {string}',
  (validFile, invalidFile, reason) => {
    cy.goToDecisionLetterPage();
    cy.uploadDecisionLetterFile(validFile);
    cy.clickSaveAndContinue();
    cy.goToDecisionLetterPage();
    cy.uploadDecisionLetterFile(invalidFile);
    cy.clickSaveAndContinue();

    switch (reason) {
      case 'file type is invalid':
        cy.confirmDecisionLetterRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        cy.confirmDecisionLetterRejectedBecause('The file must be smaller than');
        break;
    }
  },
);

When('user submits a decision letter file {string}', (filename) => {
  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile(filename);
  cy.clickSaveAndContinue();
});

When('user does not submit a decision letter file', () => {
  cy.goToDecisionLetterPage();
  cy.clickSaveAndContinue();
});

Then('decision letter file {string} is submitted and user can proceed', (filename) => {
  cy.confirmDecisionLetterAccepted(filename);
});

Then('user can see that no decision letter file is submitted', (reason) => {
  cy.confirmDecisionLetterIsNotUploaded();
});

Then(
  'user can see that the decision letter file {string} {string} submitted',
  (filename, submitted) => {
    cy.goToDecisionLetterPage();

    if (submitted === 'is') {
      cy.confirmDecisionLetterFileIsUploaded(filename);
      cy.confirmThatNoErrorTriggered();
    } else {
      cy.confirmDecisionLetterIsNotUploaded();
    }
  },
);


Then('user is informed that he needs to upload a decision letter file',() => {
  cy.confirmDecisionLetterRejectedBecause('Select a decision letter');
})

Then(
  'user is informed that the decision letter file is not submitted because {string}',
  (reason) => {
    switch (reason) {
      case 'file type is invalid':
        cy.confirmDecisionLetterRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        cy.confirmDecisionLetterRejectedBecause('The file must be smaller than');
        break;
    }
  },
);
