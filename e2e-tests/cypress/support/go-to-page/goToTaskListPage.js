module.exports = (options = {}) => {
  cy.visit('/appellant-submission/task-list', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
};
