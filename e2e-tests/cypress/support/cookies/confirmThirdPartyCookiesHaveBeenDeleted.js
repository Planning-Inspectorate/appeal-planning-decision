import {
  expectCookiePolicyCookieIsDefined,
  expectExpressSessionCookieIsDefined,
} from '../../integration/cookies/cookies';

module.exports = () => {
  cy.getCookies()
    .should('have.length', 2)
    .then((cookies) => {
      expectExpressSessionCookieIsDefined(cookies);
      expectCookiePolicyCookieIsDefined(cookies);
    });
};
