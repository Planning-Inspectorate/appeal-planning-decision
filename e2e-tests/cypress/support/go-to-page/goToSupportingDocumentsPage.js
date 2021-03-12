module.exports = () => {
  cy.visit('/appeal-householder-decision/supporting-documents');
  cy.wait(Cypress.env('demoDelay'));
};
