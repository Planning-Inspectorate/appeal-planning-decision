module.exports = () => {
  cy.get(`[data-cy="cookie-banner-rejected"]`)
  cy.wait(Cypress.env('demoDelay'));
};
