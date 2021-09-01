module.exports = () => {
  cy.url().should('include', '/appellant-submission/application-number');
  cy.wait(Cypress.env('demoDelay'));
}
