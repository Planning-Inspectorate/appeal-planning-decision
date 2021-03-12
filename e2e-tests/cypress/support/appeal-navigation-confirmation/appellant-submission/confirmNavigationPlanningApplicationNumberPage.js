module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/application-number');
  cy.wait(Cypress.env('demoDelay'));
}
