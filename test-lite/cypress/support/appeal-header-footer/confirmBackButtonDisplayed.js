module.exports = () => {
  cy.get('[data-cy="back"]').should('have.length', 1);
};
