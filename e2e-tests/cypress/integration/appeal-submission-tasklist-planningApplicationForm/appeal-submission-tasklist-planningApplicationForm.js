import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user checks the status of their appeal', () => {
  cy.goToTaskListPage();
});

When('the user selects to upload their appeal submission document', () => {
  cy.selectToUploadAppealSubmissionDocument();
});

Then('the user should be presented with opportunity to upload their appeal submission document', () => {
  cy.confirmUserPresentedWithUploadAppealSubmissionDocument();
});
