export const clickLink = (id) => {
  cy.get(`[data-cy="${id}"]`).click();
};
