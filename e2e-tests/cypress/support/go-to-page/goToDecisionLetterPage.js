module.exports = () => {
  cy.visit('/appeal-householder-decision/upload-decision', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
