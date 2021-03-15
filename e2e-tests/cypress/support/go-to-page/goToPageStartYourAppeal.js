module.exports = () => {
  cy.visit('/start-your-appeal', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
