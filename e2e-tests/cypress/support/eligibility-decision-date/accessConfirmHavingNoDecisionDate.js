module.exports = () => {
  cy.get(`[data-cy="no-decision-received"]`).click();
  cy.snapshot();
};
