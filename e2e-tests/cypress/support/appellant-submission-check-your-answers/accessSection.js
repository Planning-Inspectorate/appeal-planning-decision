module.exports = (sectionName) => {
  cy.get(`[data-cy="${sectionName}"]`).click();
  cy.snapshot();
};
