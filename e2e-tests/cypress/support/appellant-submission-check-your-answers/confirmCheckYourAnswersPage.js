module.exports = () => {
  cy.url().should('include', '/appellant-submission/check-answers');
  cy.snapshot();
};
