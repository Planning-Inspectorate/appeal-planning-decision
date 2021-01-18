import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the user is navigated to "Appeal tasks"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/task-list');
});

Then('the user is navigated to "Applicant name"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/applicant-name');
});

Then('the user is navigated to "Supporting documents"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/supporting-documents');
});

Then('the user is navigated to "Site access"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/site-access');
});

Then('the user is navigated to "Site ownership"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/site-ownership');
});

Then('the user is navigated to "Site ownership certb"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/site-ownership-certb');
});

Then('the user is navigated to "Site safety"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/site-access-safety');
});

Then('the user is navigated to "Upload application"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/upload-application');
});

Then('the user is navigated to "Upload decision letter"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/upload-decision');
});

Then('the user is navigated to "Your details"', () => {
  cy.userIsNavigatedToPage('/appellant-submission/your-details');
});
