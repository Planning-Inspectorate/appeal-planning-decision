import { expectCookiePolicy } from '../../integration/cookies/cookies';

module.exports = (policy) => {
  cy.getCookies()
    .then((cookies) => {
      expectCookiePolicy(cookies, JSON.stringify(policy));
    });
  cy.wait(Cypress.env('demoDelay'));
};
