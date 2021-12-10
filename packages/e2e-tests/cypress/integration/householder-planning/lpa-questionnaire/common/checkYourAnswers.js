import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getSubTaskInfo } from '../../../../support/common/subTasks';

const pageId = 'confirm-answers';

Given('a change to answer {string} is requested from Change your answers page', (answer) => {
  cy.goToCheckYourAnswersPage();

  const subTask = getSubTaskInfo(answer);

  if (subTask) {
    cy.clickOnSubTaskLink(subTask.id);
  } else {
    // TODO: when all features use the alias structure for pages, only this handling is needed
    cy.get('@page').then(({ id }) => {
      cy.clickOnSubTaskLink(id);
    });
  }
});

When('Check your Answers is displayed', () => {
  cy.goToCheckYourAnswersPage();
});

Then('progress is made to the Check Your Answers page', () => {
  cy.verifyPage(pageId);
});
