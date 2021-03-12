import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the user is navigated to "Appeal tasks"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/task-list');
});

Then('the user is navigated to "Applicant name"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/applicant-name');
});

Then('the user is navigated to "Supporting documents"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/supporting-documents');
});

Then('the user is navigated to "Site access"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/site-access');
});

Then('the user is navigated to "Site ownership"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/site-ownership');
});

Then('the user is navigated to "Site ownership certb"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/site-ownership-certb');
});

Then('the user is navigated to "Site safety"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/site-access-safety');
});

Then('the user is navigated to "Upload application"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/upload-application');
});

Then('the user is navigated to "Upload decision letter"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/upload-decision');
});

Then('the user is navigated to "Your details"', () => {
  cy.userIsNavigatedToPage('/appeal-householder-decision/your-details');
});
