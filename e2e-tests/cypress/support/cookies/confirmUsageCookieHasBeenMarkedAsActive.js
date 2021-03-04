import { findCookieObjectByName } from '../../integration/cookies/cookies';
import cookieConfig from '../../../../packages/forms-web-app/src/lib/client-side/cookie/cookie-config';

module.exports = () => {
  cy.getCookies().then((cookies) => {
    expect(findCookieObjectByName(cookies, cookieConfig.COOKIE_POLICY_KEY).usage).isTrue();
  });
};
