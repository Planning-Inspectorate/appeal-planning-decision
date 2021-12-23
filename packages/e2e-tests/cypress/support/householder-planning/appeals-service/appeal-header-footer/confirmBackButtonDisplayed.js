export const confirmBackButtonDisplayed = () => {
  cy.get('[data-cy="back"]').should('have.length', 1);
};
