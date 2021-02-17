module.exports = (title) => {
  cy.title().should('eq', title);
};
