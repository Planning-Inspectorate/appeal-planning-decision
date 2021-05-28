module.exports = (cyTag) => {
  cy.get(`[data-cy="${cyTag}"]`).check();
  cy.wait(Cypress.env('demoDelay'));
};
