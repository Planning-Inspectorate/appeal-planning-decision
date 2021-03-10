module.exports = () => {
  cy.visit('/stages-of-an-appeal', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
