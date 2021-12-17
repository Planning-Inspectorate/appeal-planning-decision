module.exports = (text) => {
  cy.contains(text);
  cy.wait(Cypress.env('demoDelay'));
}
