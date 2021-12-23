import { expectCookiePolicy } from '../../../../integration/householder-planning/appeals-service/cookies/cookies';

export const confirmCookiePolicy = (policy) => {
  cy.getCookies()
    .then((cookies) => {
      expectCookiePolicy(cookies, JSON.stringify(policy));
    });
 // cy.wait(Cypress.env('demoDelay'));
};
