module.exports = () => {
  cy.visit('/appellant-submission/confirmation', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
