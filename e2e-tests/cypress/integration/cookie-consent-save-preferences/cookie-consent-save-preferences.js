import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user is managing their cookie preference', () => {
  cy.goToCookiePreferencesPage();
});

When('the user disables a not necessary cookie', () => {
  cy.checkRadioButton('usage-cookies-no');
  cy.get('[data-cy="button-save-changes"]').click();
});

When('the user enables a not necessary cookie', () => {
  cy.checkRadioButton('usage-cookies-yes');
  cy.get('[data-cy="button-save-changes"]').click();
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
});

Then('the user should not see the cookie banner', () => {
  cy.confirmCookieConsentBannerIsNotVisible();
});
