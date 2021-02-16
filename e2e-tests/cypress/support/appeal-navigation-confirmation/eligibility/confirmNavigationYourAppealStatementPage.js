module.exports = () => {
  cy.url().should('include', '/eligibility/appeal-statement');
  cy.snapshot();
}
