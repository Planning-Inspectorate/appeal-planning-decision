export const confirmTaskIsAvailableForSelection = (task, url) => {
  cy.get('[data-cy="' + task + '"]')
    .should('have.attr', 'href')
    .and('include', url);
};
