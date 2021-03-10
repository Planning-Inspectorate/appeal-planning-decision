module.exports = () => {
  cy.visit('/appeal-householder-decision/your-details', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
