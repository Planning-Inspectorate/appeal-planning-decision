module.exports = () => {
  cy.get('[data-cy="back"]').should('not.exist');
};
