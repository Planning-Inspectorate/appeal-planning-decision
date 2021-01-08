module.exports = () => {
  cy.visit('/appellant-submission/submission', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
