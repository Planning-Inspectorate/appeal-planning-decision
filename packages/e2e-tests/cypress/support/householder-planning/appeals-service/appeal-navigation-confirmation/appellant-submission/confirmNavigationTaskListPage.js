export const confirmNavigationTaskListPage = () => {
  cy.url().should('include', '/appellant-submission/task-list');
  //cy.wait(Cypress.env('demoDelay'));
}
