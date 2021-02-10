module.exports = () => {
  cy.url().should('include', '/eligibility/householder-planning-permission');
  cy.wait(Cypress.env('demoDelay'));
}
