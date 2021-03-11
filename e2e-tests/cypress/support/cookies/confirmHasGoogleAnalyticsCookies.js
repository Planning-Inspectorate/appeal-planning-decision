import { findCookieObjectByName } from '../../integration/cookies/cookies';
import cookieConfig from '../../../../packages/forms-web-app/src/lib/client-side/cookie/cookie-config';

module.exports = () => {
  cy.getCookie('_ga').should('exist');
};
