module.exports = (cyTag) => {
  cy.get(`[data-cy="${cyTag}"]`).should('exist');
  cy.wait(Cypress.env('demoDelay'));
};
