import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const url = '/task-list';

Given('a LPA Planning Officer is reviewing their LPA Questionnaire task list', () => {
  cy.goToTaskListPage();
});

When('LPA Planning Officer is reviewing the Task List', () => {
  cy.goToTaskListPage();
});

When('LPA Planning Officer chooses to provide information about {string}', () => {
  cy.get('@page').then(({ id }) => {
    cy.clickOnSubTaskLink(id);
  });
});

Then('progress is made to the task list', () => {
  cy.verifyPage(url);
});

Then('the LPA Planning Officer is taken to the Task List', () => {
  cy.verifyPage(url);
});

Then('the {string} subsection is shown as completed', () => {
  cy.get('@page').then(({ id }) => {
    cy.verifyCompletedStatus(id);
  });
});
