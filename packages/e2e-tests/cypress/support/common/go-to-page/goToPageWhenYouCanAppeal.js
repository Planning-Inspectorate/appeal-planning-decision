module.exports = () => {
  cy.visit('/when-you-can-appeal', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
