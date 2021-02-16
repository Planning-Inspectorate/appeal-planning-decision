module.exports = (page) => {
  cy.url().should('include', page);
  cy.snapshot();
};
