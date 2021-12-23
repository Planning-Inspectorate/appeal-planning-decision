export const validateBackLinkIsNotAvailable = () => {
  cy.get('[data-cy="back"]').should('not.exist');
};
