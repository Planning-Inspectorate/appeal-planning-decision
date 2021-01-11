module.exports = () => {
  cy.visit('/appellant-submission/site-ownership', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
