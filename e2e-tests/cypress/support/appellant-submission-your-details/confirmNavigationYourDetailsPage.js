module.exports = () => {
  cy.url().should('include', '/appellant-submission/your-details');
  cy.snapshot();
}
