import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a user visits the site with JavaScript disabled', () => {
  cy.visit('/', { script: false });
});

When('the user views the cookie preferences page', () => {
  cy.viewCookiePageUsingCookieConsentBannerLink();
});

Then('the cookies page is presented', () => {
  cy.goToCookiesPage('/cookies');
});
