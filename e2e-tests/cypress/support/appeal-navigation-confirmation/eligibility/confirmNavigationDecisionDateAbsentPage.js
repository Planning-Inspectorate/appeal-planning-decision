module.exports = () => {
  cy.url().should('include', '/eligibility/no-decision');
  cy.wait(Cypress.env('demoDelay'));
}
