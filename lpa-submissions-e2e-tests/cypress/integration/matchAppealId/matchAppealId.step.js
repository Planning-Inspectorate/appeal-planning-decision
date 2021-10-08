import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { input } from '../../support/PageObjects/common-page-objects';
import authenticateLPA from '../../support/magic-link/authenticateLPA';

Given('answers have been saved to the questionnaire', () => {
  cy.completeQuestionnaire();
});

When('the questionnaire is revisited in a new session', () => {
  // First go to a page to create an initial session
  cy.goToTaskListPage();
  cy.verifyCompletedStatus('submissionAccuracy');

  // Clear cookies to remove tie to session
  cy.clearCookies();

  // authenticate again to have access to the LPA Questionnaire page
  authenticateLPA();

  // Reloading the page will generate a new session
  cy.reload();
});

When('changes are made to the questions', () => {
  cy.goToPage('accuracy-submission');
  input('accurate-submission-yes').check();
  cy.clickSaveAndContinue();
});

Then('previously entered data will be visible', () => {
  cy.verifyCompletedStatus('submissionAccuracy');
});

Then('the changes over write the previously saved answers', () => {
  cy.goToPage('accuracy-submission');
  input('accurate-submission-yes').should('be.checked');
});
