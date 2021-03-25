module.exports = () => {
  cy.visit('/appellant-submission/appeal-statement', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));

  cy.checkPageA11y();
};
