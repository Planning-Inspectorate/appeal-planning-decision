module.exports = () => {
  cy.visit('/appellant-submission/upload-decision', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));

  cy.checkPageA11y();
};
