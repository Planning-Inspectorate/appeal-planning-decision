module.exports = (url) => {
  cy.url().should('include', url);
};
