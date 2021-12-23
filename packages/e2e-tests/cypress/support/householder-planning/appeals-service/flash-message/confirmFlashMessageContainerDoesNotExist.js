export const confirmFlashMessageContainerDoesNotExist = (cyTag) => {
  cy.get(`[data-cy="flash-message-container"]`).should('not.exist');
};
