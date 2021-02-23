import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  expectCookieIsNotDefined,
  expectCookiePolicy,
  expectExpressSessionCookieIsDefined,
} from '../cookies/cookies';
import { DEFAULT_COOKIE_POLICY } from '../../../../packages/forms-web-app/src/lib/cookies';

Given('a user has not previously submitted cookie preferences', () => {
  cy.clearCookies();
});

When('the user visits the service', () => {
  cy.goToHouseholderQuestionPage();
});

Then('not necessary cookies are disabled', () => {
  const expectedCookiePolicy = JSON.stringify(DEFAULT_COOKIE_POLICY);

  cy.getCookies()
    .should('have.length', 2)
    .then((cookies) => {
      expectExpressSessionCookieIsDefined(cookies);
      expectCookiePolicy(cookies, expectedCookiePolicy);

      expectCookieIsNotDefined(cookies, 'cookie_preferences_set');
    });
});
