export const confirmFlashMessageExists = (cyTag) => {
  cy.get(`[data-cy="${cyTag}"]`).should('exist');
};
