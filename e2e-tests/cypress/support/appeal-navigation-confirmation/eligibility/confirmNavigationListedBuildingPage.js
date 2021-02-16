module.exports = () => {
  cy.url().should('include', '/eligibility/listed-building');
  cy.snapshot();
}
