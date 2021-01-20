module.exports = () => {
  cy.get('head script[data-cy="Google Analytics"]').should(
    'have.attr',
    'src',
    'https://www.googletagmanager.com/gtag/js?id=G-RTYZW789M0',
  );
  cy.wait(Cypress.env('demoDelay'));
};
