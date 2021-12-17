module.exports = () => {
  cy.url().should('include', '/appellant-submission/your-details');
  cy.wait(Cypress.env('demoDelay'));
}
