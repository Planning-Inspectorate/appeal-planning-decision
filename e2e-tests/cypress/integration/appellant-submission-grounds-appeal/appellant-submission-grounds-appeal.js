import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When("I don't provide an appeal statement", () => {
  cy.goToAppealSubmissionPage();
});

When('I provide an appeal statement with a good format', () => {
  cy.goToAppealSubmissionPage();
  cy.uploadFile('appeal-good-format.pdf');
});

When('I provide an empty file with good format', () => {
  cy.goToAppealSubmissionPage();
  cy.uploadFile('empty-file');
});

When('I provide an appeal statement with a bad format', () => {
  cy.goToAppealSubmissionPage();
  cy.uploadFile('appeal-bad-format.mp3');
});

When('I provide a valid appeal statement with no sensitive data', () => {
  cy.goToAppealSubmissionPage();
  cy.uploadFile('appeal-good-format.pdf');
  cy.checkNoSensitiveInformationIncludedInAppealStatement();
});

Then('I can proceed with the provided appeal statement', () => {
  cy.confirmUploadWasAccepted();
});

Then('I am informed that I have to upload the appeal statement', () => {
  cy.confirmUploadWasRejected('Select an appeal statement');
});

Then('I am informed that the appeal statement has a wrong format', () => {
  cy.confirmUploadWasRejected(
    'Doc is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG',
  );
});

Then('I am informed that I have to confirm the privacy safety', () => {
  cy.confirmUploadWasRejected('Confirm that your statement does not include sensitive information');
});
