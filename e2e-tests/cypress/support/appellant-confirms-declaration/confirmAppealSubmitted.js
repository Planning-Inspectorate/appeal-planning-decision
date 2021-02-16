module.exports = () => {
  cy.url().should('include', '/appellant-submission/confirmation');
  cy.snapshot();
};
