import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { DEFAULT_COOKIE_POLICY } from '../../../../packages/forms-web-app/src/lib/cookies';
import { expectCookieIsNotDefined, expectCookiePolicy, expectExpressSessionCookieIsDefined } from '../cookies/cookies';

When('the user navigates through the service', () => {
  cy.goToLandingPage();
  cy.goToTaskListPage();
});

When('the user accepts not necessary cookies', () => {
  // To do
});

When('the user rejects not necessary cookies', () => {
  // To do
});

Then('the cookie banner remains until actioned', () => {
  // To do
});

Then('the GA cookies are enabled', () => {
  // To do
});

Then('the GA cookies remain disabled', () => {
  // To do
});

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
