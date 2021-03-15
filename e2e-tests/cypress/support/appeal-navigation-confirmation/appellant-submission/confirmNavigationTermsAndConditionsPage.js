module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/submission');
  cy.wait(Cypress.env('demoDelay'));
}
