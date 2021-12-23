import {
  expectCookiePolicyCookieIsDefined,
  expectExpressSessionCookieIsDefined,
} from '../../../../integration/householder-planning/appeals-service/cookies/cookies';

export const confirmThirdPartyCookiesHaveBeenDeleted = () => {
  cy.getCookies()
    .should('have.length', 2)
    .then((cookies) => {
      expectExpressSessionCookieIsDefined(cookies);
      expectCookiePolicyCookieIsDefined(cookies);
    });
};
