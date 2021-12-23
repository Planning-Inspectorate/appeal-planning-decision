export const confirmGoogleAnalyticsLinkIsPresent = () => {
  cy.get('head script[data-cy="Google Analytics"]').should(
    'have.attr',
    'src',
    'https://www.googletagmanager.com/gtag/js?id=',
  );
 // cy.wait(Cypress.env('demoDelay'));
};
