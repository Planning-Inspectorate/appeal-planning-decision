module.exports = () => {
  cy.visit('/appellant-submission/upload-decision');
  cy.wait(Cypress.env('demoDelay'));
};
