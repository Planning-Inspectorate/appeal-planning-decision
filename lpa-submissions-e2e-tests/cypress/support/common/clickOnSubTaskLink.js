module.exports = (taskName) => {
  cy.get(`[data-cy="${taskName}"]`).click();
};
