module.exports = () => {
  cy.visit('/appeal-householder-decision/site-access-safety', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));
};
