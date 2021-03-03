module.exports = () => {
  cy.visit('/appellant-submission/site-location', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
