module.exports = (options = {}) => {
  cy.visit('/cookies', options);
  cy.wait(Cypress.env('demoDelay'));
};
