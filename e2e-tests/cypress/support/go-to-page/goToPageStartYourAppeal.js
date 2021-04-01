module.exports = (options = {}) => {
  cy.visit('/start-your-appeal', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
};
