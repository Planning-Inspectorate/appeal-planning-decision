module.exports = () => {
  cy.url().should('include', '/appellant-submission/submission');
  cy.wait(Cypress.env('demoDelay'));
}
