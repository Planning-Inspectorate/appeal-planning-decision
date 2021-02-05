module.exports = () => {
  cy.url().should('include', '/eligibility/appeal-statement');
  cy.wait(Cypress.env('demoDelay'));
}
