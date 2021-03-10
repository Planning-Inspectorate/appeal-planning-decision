module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/appealing-on-behalf-of');
  cy.wait(Cypress.env('demoDelay'));
}
