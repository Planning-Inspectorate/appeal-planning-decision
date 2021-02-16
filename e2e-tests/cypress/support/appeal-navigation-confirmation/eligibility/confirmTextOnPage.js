module.exports = (text) => {
  cy.contains(text);
  cy.snapshot();
}
