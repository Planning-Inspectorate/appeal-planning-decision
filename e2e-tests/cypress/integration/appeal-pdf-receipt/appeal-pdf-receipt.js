import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
const OWNERS_INFORMED = require('../../fixtures/expected-appeal-without-certificate-a-other-owner-informed.json');

Given('an agent or appellant has submitted an appeal and they do not wholly own the site', () => {
  cy.provideCompleteAppeal(OWNERS_INFORMED);
});

When('the pdf is viewed', () => {
  cy.clickPDFLink();
});

Then('the answer for other owner notification is displayed as submitted', () => {
  cy.confirmPDFContent();
});
