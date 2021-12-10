export const clickOnSubTaskLink = (taskName) => {
  cy.get(`[data-cy="${taskName}"]`).click();
};
