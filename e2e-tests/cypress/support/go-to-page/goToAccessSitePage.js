module.exports = () => {
  cy.visit('/appeal-householder-decision/site-access', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
