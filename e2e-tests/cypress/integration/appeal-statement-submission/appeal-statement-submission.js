import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';


Given('user did not previously submitted an appeal statement file', () => {});


Given('user has previously submitted an appeal statement file {string}', (filename) => {
  cy.goToAppealStatementSubmission();
  cy.checkNoSensitiveInformation();
  cy.uploadAppealStatementFile(filename);
  cy.clickSaveAndContinue();
});

When(
  'user confirms that there is no sensitive information without selecting an appeal statement file to upload',
  () => {
    cy.goToAppealStatementSubmission();
    cy.checkNoSensitiveInformation();
    cy.clickSaveAndContinue();
  },
);


When('user does not confirm that there is no sensitive information nor upload a statement',() => {
  cy.goToAppealStatementSubmission();
  cy.clickSaveAndContinue();
})

When(
  'user submits an appeal statement file {string} confirming that it {string} contain sensitive information',
  (filename, has_sensitive_info) => {
    cy.goToAppealStatementSubmission();
    if (has_sensitive_info === 'does not') {
      cy.checkNoSensitiveInformation();
    } else {
      cy.uncheckNoSensitiveInformation();
    }
    cy.uploadAppealStatementFile(filename);
    cy.clickSaveAndContinue();
  },
);

Then('user can see that no appeal statement file is submitted', () => {
  cy.confirmAppealStatementFileIsNotUploaded();
});

Then(
  'user can see that the appeal statement file {string} {string} submitted',
  (filename, submitted) => {
    if (submitted === 'is') {
      cy.confirmAppealStatementFileIsUploaded(filename);
      cy.confirmThatNoErrorTriggered();
    } else {
      cy.confirmAppealStatementFileIsNotUploaded();
    }
  },
);

Then('user is informed that the file is not submitted because {string}', (reason) => {
  cy.title().should('match', /^Error: /);
  switch (reason) {
    case 'file contains sensitive information':
      cy.confirmFileContainsSensitiveInformation();
      break;
    case 'file type is invalid':
      cy.confirmFileInvalidBecauseWrongFileType();
      break;
    case 'file size exceeds limit':
      cy.confirmFileInvalidBecauseExceedsSizeLimit();
      break;
  }
});


Then('user is informed that he needs to select an appeal statement',() => {
  cy.confirmFileUploadIsRequested();
  cy.title().should('match', /^Error: /);
});


Then('user is informed that he needs to select an appeal statement and confirms that it does not contain sensitive information',() =>{
  cy.confirmFileUploadIsRequested();
  cy.confirmFileContainsSensitiveInformation();
  cy.title().should('match', /^Error: /);
})


Given(
  'user has previously submitted a valid appeal statement file {string} followed by an invalid file {string} that was rejected because {string}',
  (validFile, invalidFile, reason) => {
    cy.goToAppealStatementSubmission();
    cy.checkNoSensitiveInformation();
    cy.uploadAppealStatementFile(validFile);
    cy.clickSaveAndContinue();
    cy.goToAppealStatementSubmission();
    cy.checkNoSensitiveInformation();
    cy.uploadAppealStatementFile(invalidFile);
    cy.clickSaveAndContinue();
    switch (reason) {
      case 'file type is invalid':
        cy.confirmFileInvalidBecauseWrongFileType();
        break;
      case 'file size exceeds limit':
        cy.confirmFileInvalidBecauseExceedsSizeLimit();
        break;
    }
  },
);
