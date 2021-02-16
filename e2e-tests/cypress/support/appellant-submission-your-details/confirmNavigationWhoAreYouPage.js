module.exports = () => {
  cy.url().should('include', '/appellant-submission/who-are-you');
  cy.snapshot();
}
