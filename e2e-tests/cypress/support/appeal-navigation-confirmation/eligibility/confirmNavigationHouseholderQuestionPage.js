module.exports = () => {
  cy.url().should('include', '/eligibility/householder-planning-permission');
  cy.snapshot();
}
