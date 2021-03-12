module.exports = () => {
  cy.visit('/appeal-householder-decision/upload-application', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
