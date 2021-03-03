module.exports = () => {
  cy.visit('/appellant-submission/site-access', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
