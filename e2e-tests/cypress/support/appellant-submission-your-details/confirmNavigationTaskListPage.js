module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/task-list');
  cy.wait(Cypress.env('demoDelay'));
}
