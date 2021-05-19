import { findCookieObjectByName } from '../../integration/cookies/cookies';
import cookieConfig from '../../../../packages/common/src/lib/client-side/cookie/cookie-config';

module.exports = () => {
  cy.getCookies().then((cookies) => {
    const cookie = JSON.parse(
      findCookieObjectByName(cookies, cookieConfig.COOKIE_POLICY_KEY).value,
    );
    expect(cookie.usage).to.eq(true);
  });
};
