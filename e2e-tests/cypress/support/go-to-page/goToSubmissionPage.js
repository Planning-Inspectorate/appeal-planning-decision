module.exports = () => {
  cy.visit('/appeal-householder-decision/submission', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
