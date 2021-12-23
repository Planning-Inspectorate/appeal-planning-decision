export const confirmTaskIsNotAvailableForSelection = (task, url) => {
  cy.get('[data-cy="' + task + '"]').should('not.have.attr', 'href');
};
