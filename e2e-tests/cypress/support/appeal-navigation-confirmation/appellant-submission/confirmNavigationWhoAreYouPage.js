module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/who-are-you');
  cy.wait(Cypress.env('demoDelay'));
}
