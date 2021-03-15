module.exports = () => {
  cy.get(`[data-cy="cookie-banner"]`).should('not.be.visible');
  cy.wait(Cypress.env('demoDelay'));
};
