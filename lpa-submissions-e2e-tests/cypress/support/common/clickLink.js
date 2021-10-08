module.exports = (id) => {
  cy.get(`[data-cy="${id}"]`).click();
};
