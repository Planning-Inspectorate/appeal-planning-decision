module.exports = () => {
  cy.contains('Page not found');
  cy.wait(Cypress.env('demoDelay'));
}
