module.exports = () => {
  cy.visit('/appellant-submission/upload-application');
  cy.wait(Cypress.env('demoDelay'));
};
