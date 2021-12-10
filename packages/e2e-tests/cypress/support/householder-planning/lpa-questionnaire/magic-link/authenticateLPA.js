import createAuthToken from './createAuthToken';

export const authenticateLPA = () => {
  const token = createAuthToken();
  cy.setCookie(Cypress.env('AUTH_COOKIE_NAME'), token);
};
