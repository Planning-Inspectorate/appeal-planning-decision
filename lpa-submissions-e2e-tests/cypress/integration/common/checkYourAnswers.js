import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { getSubTaskInfo } from '../../support/common/subTasks';

const pageId = 'confirm-answers'

let currentSubTask = {};

Before(() => {
  currentSubTask = {};
});

Given('a change to answer {string} is requested from Change your answers page', (answer) => {
  cy.goToCheckYourAnswersPage();
  currentSubTask = getSubTaskInfo(answer);
  cy.clickOnSubTaskLink(currentSubTask.id);
});

When('Check your Answers is displayed', () => {
  cy.goToCheckYourAnswersPage();
});

Then('progress is made to the Check Your Answers page', () => {
  cy.verifyPage(pageId);
});
