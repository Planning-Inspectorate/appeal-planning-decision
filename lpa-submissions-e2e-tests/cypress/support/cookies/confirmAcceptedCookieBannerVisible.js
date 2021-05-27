module.exports = () => {
  cy.get(`[data-cy="cookie-banner-accepted"]`)
  cy.wait(Cypress.env('demoDelay'));
};
