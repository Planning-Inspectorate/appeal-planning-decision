module.exports = () => {
  cy.url().should('include', '/eligibility/householder-planning-permission-out');
  cy.wait(Cypress.env('demoDelay'));
}
