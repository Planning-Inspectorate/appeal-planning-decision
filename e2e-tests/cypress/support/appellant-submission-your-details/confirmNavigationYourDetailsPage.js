module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/your-details');
  cy.wait(Cypress.env('demoDelay'));
}
