import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
  goToTaskListPage
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/goToTaskListPage';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { verifyPage } from '../../../../support/common/verifyPage';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';

const url = 'task-list';


Given('a LPA Planning Officer is reviewing their LPA Questionnaire task list', () => {
       goToTaskListPage(url);
});

When('LPA Planning Officer is reviewing the Task List', () => {
  goToTaskListPage(url);
});

When('LPA Planning Officer chooses to provide information about {string}', () => {
  cy.get('@page').then(({ id }) => {
    clickOnSubTaskLink(id);
  });
});

Then('progress is made to the task list', () => {
  verifyPage(url);
});

Then('the LPA Planning Officer is taken to the Task List', () => {
  verifyPage(url);
});

Then('the {string} subsection is shown as completed', () => {
  cy.get('@page').then(({ id }) => {
    verifyCompletedStatus(id);
  });
});
