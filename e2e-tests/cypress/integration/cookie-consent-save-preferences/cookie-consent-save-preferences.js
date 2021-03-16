import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user is managing their cookie preference', () => {
  cy.goToCookiePreferencesPage();
});

Given('a user has saved their cookie preferences', () => {
  cy.goToCookiePreferencesPage();
  cy.checkRadioButton('usage-cookies-yes');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('the user disables a not necessary cookie', () => {
  cy.checkRadioButton('usage-cookies-no');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('the user enables a not necessary cookie', () => {
  cy.checkRadioButton('usage-cookies-yes');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('the user saves their preferences', () => {
  cy.checkRadioButton('usage-cookies-yes');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('they select to go back to their previous page', () => {
  cy.get('[data-cy="cookies-updated-go-back-link"]').click();
});

When('the page is refreshed', () => {
  cy.reload();
});

Then('the not necessary cookies are shown as neither enabled or disabled', () => {
  cy.confirmUsageCookiesHaveNoExistingState();
});

Then('the usage cookie is marked as inactive', () => {
  cy.confirmUsageCookieRadioButtonIsMarkedAsInactive();
});

Then('any existing third party cookies have been deleted', () => {
  cy.confirmThirdPartyCookiesHaveBeenDeleted();
});

Then('the not necessary cookie is active from that point onwards', () => {
  cy.confirmUsageCookieHasBeenMarkedAsActive();
  cy.confirmHasGoogleAnalyticsCookies();
});

Then('the user should not see the cookie banner', () => {
  cy.confirmCookieConsentBannerIsNotVisible();
});

Then('the user will receive a confirmation message', () => {
  cy.confirmCookieFlashMessageContent({
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
  cy.confirmFlashMessageContainerDoesNotExist();
});
