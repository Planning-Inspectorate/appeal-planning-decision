module.exports = (options = {}) => {
  cy.visit('/appellant-submission/site-location', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
};
