module.exports = () => {
  cy.visit('/appeal-householder-decision/appeal-statement', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
