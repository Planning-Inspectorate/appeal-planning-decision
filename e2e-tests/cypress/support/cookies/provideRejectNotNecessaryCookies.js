module.exports = () => {
  cy.get('[data-cy="cookie-banner-reject-analytics-cookies"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
