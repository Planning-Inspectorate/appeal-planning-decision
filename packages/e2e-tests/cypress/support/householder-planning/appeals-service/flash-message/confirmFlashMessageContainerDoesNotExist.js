export const confirmFlashMessageContainerDoesNotExist = () => {
	cy.get(`[data-cy="flash-message-container"]`).should('not.exist');
};
