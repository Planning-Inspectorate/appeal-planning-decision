export const viewCookiePageUsingCookieConsentBannerLink= () => {
  cy.get('[data-cy="cookie-banner-view-cookies"]').click();
  //cy.wait(Cypress.env('demoDelay'));
};
