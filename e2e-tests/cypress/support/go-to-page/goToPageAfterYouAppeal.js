module.exports = () => {
  cy.visit('/after-you-appeal', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
  };
