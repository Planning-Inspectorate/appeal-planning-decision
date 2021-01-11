module.exports = () => {
  cy.visit('/appellant-submission/your-details', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
