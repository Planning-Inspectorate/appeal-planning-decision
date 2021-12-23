import { findCookieObjectByName } from '../../../../integration/householder-planning/appeals-service/cookies/cookies';
import cookieConfig from '../../../../../../forms-web-app/src/lib/client-side/cookie/cookie-config';

export const confirmUsageCookieHasBeenMarkedAsActive = () => {
  cy.getCookies().then((cookies) => {
    const cookie = JSON.parse(
      findCookieObjectByName(cookies, cookieConfig.COOKIE_POLICY_KEY).value,
    );
    expect(cookie.usage).to.eq(true);
  });
};
