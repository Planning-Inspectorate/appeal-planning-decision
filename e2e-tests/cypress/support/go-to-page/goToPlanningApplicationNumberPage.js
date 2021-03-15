module.exports = () => {
  cy.visit('/appeal-householder-decision/application-number', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
