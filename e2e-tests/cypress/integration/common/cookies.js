import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { expectCookieIsNotDefined, expectExpressSessionCookieIsDefined } from '../cookies/cookies';

When('the user neither accepts nor rejects not necessary cookies', () => {
  cy.goToTaskListPage();
});

When('the user accepts not necessary cookies', () => {
  cy.provideAcceptNotNecessaryCookies();
});

When('the user rejects not necessary cookies', () => {
  cy.provideRejectNotNecessaryCookies();
});

Then('the cookie banner remains visible', () => {
  cy.confirmNoDecisionCookieBannerVisible();
});

Then('the accepted cookie banner becomes visible', () => {
  cy.confirmAcceptedCookieBannerVisible();
});

Then('the rejected cookie banner becomes visible', () => {
  cy.confirmRejectedCookieBannerVisible();
});

Then('the GA cookies are enabled', () => {
  cy.goToTaskListPage();
  const expectedCookiePolicy = {
    essential: true,
    settings: true,
    usage: true,
    campaigns: true,
  };
  cy.confirmCookiePolicy(expectedCookiePolicy);
});

Then('the GA cookies remain disabled', () => {
  cy.goToTaskListPage();
  const expectedCookiePolicy = {
    essential: true,
    settings: true,
    usage: false,
    campaigns: true,
  };
  cy.confirmCookiePolicy(expectedCookiePolicy);
});

Given('a user has not previously submitted cookie preferences', () => {
  cy.clearCookies();
});

When('the user visits the service', () => {
  cy.goToHouseholderQuestionPage();
});

Then('not necessary cookies are disabled', () => {
  cy.getCookies()
    .should('have.length', 1)
    .then((cookies) => {
      expectExpressSessionCookieIsDefined(cookies);
      expectCookieIsNotDefined(cookies, 'cookie_policy');
      expectCookieIsNotDefined(cookies, 'cookie_preferences_set');
    });
});
