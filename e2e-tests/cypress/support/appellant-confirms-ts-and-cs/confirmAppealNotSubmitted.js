module.exports = () => {
  cy.url().should('include', '/submission');
};
