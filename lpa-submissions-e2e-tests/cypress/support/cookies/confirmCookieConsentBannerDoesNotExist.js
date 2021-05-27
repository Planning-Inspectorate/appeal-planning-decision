module.exports = () => {
  cy.get(`[data-cy="cookie-banner"]`).should('not.exist');
  cy.wait(Cypress.env('demoDelay'));
};
