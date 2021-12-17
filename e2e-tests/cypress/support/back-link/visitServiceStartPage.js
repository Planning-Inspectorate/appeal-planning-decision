module.exports = (options = {}) => {
  cy.visit('/', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
};
