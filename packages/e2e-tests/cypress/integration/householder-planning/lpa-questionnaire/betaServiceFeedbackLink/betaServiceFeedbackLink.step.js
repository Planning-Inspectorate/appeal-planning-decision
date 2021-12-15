const { goToTaskListPage } = require('../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/goToTaskListPage');
const { hasLink } = require('../../../../support/common/hasLink');
const { verifyPage } = require('../../../../support/common/verifyPage');
const link = 'https://www.smartsurvey.co.uk/s/GHUFVZ/'
const selector = '[data-cy="Feedback"]';

Given('the LPA Questionnaire is accessed', () => {
  goToTaskListPage('task-list');
  hasLink(selector, link);
});

When('the feedback link is selected', () => {
  cy.get(selector).click();
});

Then('the feedback survey is presented', () => {
  verifyPage(link);
});
