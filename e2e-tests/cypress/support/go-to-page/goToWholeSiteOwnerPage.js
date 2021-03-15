module.exports = () => {
  cy.visit('/appeal-householder-decision/site-ownership', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
