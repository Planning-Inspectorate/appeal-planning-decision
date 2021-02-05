module.exports = () => {
  cy.url().should('include', '/eligibility/costs-out');
  cy.wait(Cypress.env('demoDelay'));
}
