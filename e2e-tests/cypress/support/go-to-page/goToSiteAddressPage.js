module.exports = () => {
  cy.visit('/appeal-householder-decision/site-location', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
