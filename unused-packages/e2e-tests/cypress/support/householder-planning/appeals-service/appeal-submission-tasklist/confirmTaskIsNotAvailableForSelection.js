export const confirmTaskIsNotAvailableForSelection = (task) => {
	cy.get('[data-cy="' + task + '"]').should('not.have.attr', 'href');
};
