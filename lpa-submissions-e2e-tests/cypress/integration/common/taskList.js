import { Given } from 'cypress-cucumber-preprocessor/steps';

const url = '/task-list';

Given("a LPA Planning Officer is reviewing their LPA Questionnaire task list", ()=> {
  cy.goToTaskListPage();
});

Then('progress is made to the task list', () => {
  cy.verifyPage(url);
});

Then('the LPA Planning Officer is taken to the Task List', () => {
  cy.verifyPage(url);
});
