module.exports = () => {
  cy.visit('/appellant-submission/supporting-documents');
  cy.wait(Cypress.env('demoDelay'));
};
