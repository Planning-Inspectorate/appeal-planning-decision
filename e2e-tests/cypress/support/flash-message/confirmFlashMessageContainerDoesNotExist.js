module.exports = (cyTag) => {
  cy.get(`[data-cy="flash-message-container"]`).should('not.exist');
  cy.wait(Cypress.env('demoDelay'));
};
