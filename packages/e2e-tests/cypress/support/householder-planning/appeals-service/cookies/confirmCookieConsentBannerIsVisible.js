export const confirmCookieConsentBannerIsVisible = () => {
  cy.get(`[data-cy="cookie-banner"]`)
  //cy.wait(Cypress.env('demoDelay'));
};
