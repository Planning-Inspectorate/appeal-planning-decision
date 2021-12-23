export const confirmBackButtonNotDisplayed = () => {
  cy.get('[data-cy="back"]').should('have.length', 0);
};
