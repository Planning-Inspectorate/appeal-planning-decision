import { findCookieObjectByName } from '../../integration/cookies/cookies';
import cookieConfig from '../../integration/cookies/cookie-config';

module.exports = () => {
  cy.getCookies().then((cookies) => {
    const cookie = JSON.parse(
      findCookieObjectByName(cookies, cookieConfig.COOKIE_POLICY_KEY).value,
    );
    expect(cookie.usage).to.eq(true);
  });
};
