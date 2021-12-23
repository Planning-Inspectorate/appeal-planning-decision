import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { expectCookieIsNotDefined, expectExpressSessionCookieIsDefined } from '../../householder-planning/appeals-service/cookies/cookies';
import { provideAcceptNotNecessaryCookies } from '../../../support/householder-planning/appeals-service/cookies/provideAcceptNotNecessaryCookies';
import { confirmCookieConsentBannerIsVisible } from '../../../support/householder-planning/appeals-service/cookies/confirmCookieConsentBannerIsVisible';
import { provideRejectNotNecessaryCookies } from '../../../support/householder-planning/appeals-service/cookies/provideRejectNotNecessaryCookies';
import { confirmAcceptedCookieBannerVisible } from '../../../support/householder-planning/appeals-service/cookies/confirmAcceptedCookieBannerVisible';
import { confirmRejectedCookieBannerVisible } from '../../../support/householder-planning/appeals-service/cookies/confirmRejectedCookieBannerVisible';
import { confirmCookiePolicy } from '../../../support/householder-planning/appeals-service/cookies/confirmCookiePolicy';
import { confirmCookieConsentBannerDoesNotExist } from '../../../support/householder-planning/appeals-service/cookies/confirmCookieConsentBannerDoesNotExist';
import { goToAppealsPage } from '../../../support/householder-planning/appeals-service/go-to-page/goToAppealsPage';
import { pageURLAppeal } from './pageURLAppeal';

When('the user neither accepts nor rejects not necessary cookies', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
});

When('the user accepts not necessary cookies', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  provideAcceptNotNecessaryCookies();
});

When('the user rejects not necessary cookies', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  provideRejectNotNecessaryCookies();
});

Then('the cookie banner remains visible', () => {
  confirmCookieConsentBannerIsVisible();
});

Then('the accepted cookie banner becomes visible', () => {
  confirmAcceptedCookieBannerVisible();
});

Then('the rejected cookie banner becomes visible', () => {
  confirmRejectedCookieBannerVisible();
});

Then('the GA cookies are enabled', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  const expectedCookiePolicy = {
    essential: true,
    settings: false,
    usage: true,
    campaigns: false,
  };
  confirmCookiePolicy(expectedCookiePolicy);
});

Then('the GA cookies remain disabled', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  const expectedCookiePolicy = {
    essential: true,
    settings: false,
    usage: false,
    campaigns: false,
  };
  confirmCookiePolicy(expectedCookiePolicy);
});

Given('a user has not previously submitted cookie preferences', () => {
  cy.clearCookies();
});

When('the user visits the service', () => {
  goToAppealsPage(pageURLAppeal.goToHouseholderQuestionPage);
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

Then('the cookie banner does not exist', () => {
  confirmCookieConsentBannerDoesNotExist();
});
