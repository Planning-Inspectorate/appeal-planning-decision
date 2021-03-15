module.exports = () => {
  cy.visit('/appeal-householder-decision/task-list', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
