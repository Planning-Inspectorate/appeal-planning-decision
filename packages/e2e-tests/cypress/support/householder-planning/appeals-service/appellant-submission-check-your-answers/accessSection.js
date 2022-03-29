export const accessSection = (sectionName) => {
  cy.get(`[data-cy="${sectionName}"]`).click();
};
