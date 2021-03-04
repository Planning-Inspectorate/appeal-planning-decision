import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user is managing their cookie preference', () => {
  cy.goToCookiePreferencesPage();
});

When('the user disables a not necessary cookie', () => {
  cy.checkRadioButton('usage-cookies-no');
});

When('the user enables a not necessary cookie', () => {
  cy.checkRadioButton('usage-cookies-yes');
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
