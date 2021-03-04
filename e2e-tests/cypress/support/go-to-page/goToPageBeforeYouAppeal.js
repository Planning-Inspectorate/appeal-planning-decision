module.exports = () => {
  cy.visit('/before-you-appeal', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
