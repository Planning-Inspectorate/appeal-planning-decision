module.exports = () => {
  cy.visit('/appellant-submission/task-list', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
