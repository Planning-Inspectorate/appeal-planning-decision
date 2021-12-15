import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { input } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import {
  completeQuestionnaire
} from '../../../../support/householder-planning/lpa-questionnaire/completeQuestionnaire';
import {
  goToTaskListPage
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/goToTaskListPage';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';

Given('answers have been saved to the questionnaire', () => {
  completeQuestionnaire();
});

When('the questionnaire is revisited in a new session', () => {
  // First go to a page to create an initial session
  goToTaskListPage('task-list');
  verifyCompletedStatus('submissionAccuracy');

  // Clear cookies to remove tie to session
  cy.clearCookies();

  // Reloading the page will generate a new session
  cy.reload();
});

When('changes are made to the questions', () => {
  goToLPAPage('accuracy-submission');
  input('accurate-submission-yes').check();
  clickSaveAndContinue();
});

Then('previously entered data will be visible', () => {
  verifyCompletedStatus('submissionAccuracy');
});

Then('the changes over write the previously saved answers', () => {
  goToLPAPage('accuracy-submission');
  input('accurate-submission-yes').should('be.checked');
});
