module.exports = () => {
  cy.visit('/appeal-householder-decision/who-are-you', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
