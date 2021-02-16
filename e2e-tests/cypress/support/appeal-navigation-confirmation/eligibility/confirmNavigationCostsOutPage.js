module.exports = () => {
  cy.url().should('include', '/eligibility/costs-out');
  cy.snapshot();
}
