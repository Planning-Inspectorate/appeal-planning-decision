module.exports = () => {
  cy.url().should('include', '/eligibility/decision-date');
  cy.snapshot();
}
