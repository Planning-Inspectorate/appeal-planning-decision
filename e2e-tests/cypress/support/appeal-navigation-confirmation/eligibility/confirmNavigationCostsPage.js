module.exports = () => {
  cy.url().should('include', '/eligibility/costs');
  cy.snapshot();
}
