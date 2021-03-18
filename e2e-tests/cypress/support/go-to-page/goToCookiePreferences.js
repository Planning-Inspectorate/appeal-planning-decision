module.exports = (overrides = {}) => {
  cy.visit('/cookies', overrides);
  cy.wait(Cypress.env('demoDelay'));
};
