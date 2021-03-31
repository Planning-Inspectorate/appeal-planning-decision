Given('LPA Planning Officer is reviewing their LPA Questionnaire task list', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Then('progress is made to the Task List', () => {
  cy.verifyPage('/task-list');
});

Then('the Task list is presented', () => {
  cy.verifyPage('/task-list');
});
