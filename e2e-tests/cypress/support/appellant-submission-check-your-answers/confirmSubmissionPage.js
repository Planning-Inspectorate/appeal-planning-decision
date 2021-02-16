module.exports = () => {
  cy.url().should('include', '/appellant-submission/submission');
  cy.snapshot();
};
