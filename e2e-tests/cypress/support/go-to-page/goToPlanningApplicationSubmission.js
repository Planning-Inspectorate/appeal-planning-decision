module.exports = () => {
  cy.visit('/appellant-submission/upload-application', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));

  cy.checkPageA11y();
};
