module.exports = () => {
  cy.visit('/appeal-householder-decision/appealing-on-behalf-of', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
