module.exports = () => {
  cy.visit('/appeal-householder-decision/any-other-documents');
  cy.wait(Cypress.env('demoDelay'));
};
