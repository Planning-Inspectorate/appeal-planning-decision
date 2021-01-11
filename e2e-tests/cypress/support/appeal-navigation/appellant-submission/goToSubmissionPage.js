module.exports = () => {
  cy.visit('/submission', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
