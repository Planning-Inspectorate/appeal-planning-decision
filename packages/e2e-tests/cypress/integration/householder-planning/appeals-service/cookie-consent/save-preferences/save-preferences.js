import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { checkRadioButton } from '../../../../../support/common/checkRadioButton'
import { confirmUsageCookiesHaveNoExistingState } from '../../../../../support/householder-planning/appeals-service/cookies/confirmUsageCookiesHaveNoExistingState';
import { confirmUsageCookieRadioButtonIsMarkedAsInactive } from '../../../../../support/householder-planning/appeals-service/cookies/confirmUsageCookieRadioButtonIsMarkedAsInactive';
import { confirmThirdPartyCookiesHaveBeenDeleted } from '../../../../../support/householder-planning/appeals-service/cookies/confirmThirdPartyCookiesHaveBeenDeleted';
import { confirmUsageCookieHasBeenMarkedAsActive } from '../../../../../support/householder-planning/appeals-service/cookies/confirmUsageCookieHasBeenMarkedAsActive';
import { confirmHasGoogleAnalyticsCookies } from '../../../../../support/householder-planning/appeals-service/cookies/confirmHasGoogleAnalyticsCookies';
import { confirmCookieConsentBannerIsNotVisible } from '../../../../../support/householder-planning/appeals-service/cookies/confirmCookieConsentBannerIsNotVisible';
import { confirmCookieFlashMessageContent } from '../../../../../support/householder-planning/appeals-service/cookies/confirmCookieFlashMessageContent';
import { confirmFlashMessageContainerDoesNotExist } from '../../../../../support/householder-planning/appeals-service/flash-message/confirmFlashMessageContainerDoesNotExist';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('a user is managing their cookie preference', () => {
  goToAppealsPage(pageURLAppeal.goToCookiePreferences);
});

Given('a user has saved their cookie preferences', () => {
  goToAppealsPage(pageURLAppeal.goToCookiePreferences);
  checkRadioButton('usage-cookies-yes');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('the user disables a not necessary cookie', () => {
  checkRadioButton('usage-cookies-no');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('the user enables a not necessary cookie', () => {
  checkRadioButton('usage-cookies-yes');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('the user saves their preferences', () => {
  checkRadioButton('usage-cookies-yes');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('they select to go back to their previous page', () => {
  cy.get('[data-cy="cookies-updated-go-back-link"]').click();
});

When('the page is refreshed', () => {
  cy.reload();
});

Then('the not necessary cookies are shown as neither enabled or disabled', () => {
  confirmUsageCookiesHaveNoExistingState();
});

Then('the usage cookie is marked as inactive', () => {
  confirmUsageCookieRadioButtonIsMarkedAsInactive();
});

Then('any existing third party cookies have been deleted', () => {
  confirmThirdPartyCookiesHaveBeenDeleted();
});

Then('the not necessary cookie is active from that point onwards', () => {
  confirmUsageCookieHasBeenMarkedAsActive();
  confirmHasGoogleAnalyticsCookies();
});

Then('the user should not see the cookie banner', () => {
  confirmCookieConsentBannerIsNotVisible();
});

Then('the user will receive a confirmation message', () => {
  confirmCookieFlashMessageContent({
    cyTag: 'flash-message-success-1',
    title: 'Success',
    body:
      'Government services may set additional cookies and, if so, will have their own cookie policy and banner.',
    link: '/',
  });
});

Then('their previous page will be displayed', () => {
  cy.url().should('match', /\/before-you-appeal$/);
});

Then('the confirmation message is not displayed', () => {
  confirmFlashMessageContainerDoesNotExist();
});
