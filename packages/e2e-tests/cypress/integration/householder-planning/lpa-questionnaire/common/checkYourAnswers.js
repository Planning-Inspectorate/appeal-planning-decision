import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getSubTaskInfo } from '../../../../support/common/subTasks';
import {
  goToCheckYourAnswersPage
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/goToCheckYourAnswersPage';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { verifyPage } from '../../../../support/common/verifyPage';

const pageId = 'confirm-answers';

Given('a change to answer {string} is requested from Change your answers page', (answer) => {
  goToCheckYourAnswersPage();

  const subTask = getSubTaskInfo(answer);

  if (subTask) {
    clickOnSubTaskLink(subTask.id);
  } else {
    // TODO: when all features use the alias structure for pages, only this handling is needed
    cy.get('@page').then(({ id }) => {
      clickOnSubTaskLink(id);
    });
  }
});

When('Check your Answers is displayed', () => {
  goToCheckYourAnswersPage();
});

Then('progress is made to the Check Your Answers page', () => {
  verifyPage(pageId);
});
