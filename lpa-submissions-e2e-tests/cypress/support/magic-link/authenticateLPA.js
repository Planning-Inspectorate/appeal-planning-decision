import createAuthToken from './createAuthToken';

module.exports = () => {
  const token = createAuthToken();
  cy.setCookie(Cypress.env('AUTH_COOKIE_NAME'), token);
};
