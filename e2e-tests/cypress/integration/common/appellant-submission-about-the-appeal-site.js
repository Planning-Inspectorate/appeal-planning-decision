import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('appeal site address is requested', () => {
  cy.goToSiteAddressPage();
});

When('valid appeal site address is submitted', () => {
  cy.provideAddressLine1('Address line 1');
  cy.provideAddressLine2('Address line 2');
  cy.provideCounty('Some county');
  cy.provideTownOrCity('Some town');
  cy.providePostcode('SA18 2TY');
  cy.clickSaveAndContinue();
});

When('invalid appeal site address is submitted', () => {
  cy.provideAddressLine1('');
  cy.provideAddressLine2('');
  cy.provideCounty('');
  cy.provideTownOrCity('');
  cy.providePostcode('');
  cy.clickSaveAndContinue();
});

Then('Address of the appeal site section is {string}', (status) => {
  cy.goToTaskListPage();
  cy.checkStatusForTask('SiteAddress', status);
});

Then('Ownership of the appeal site section is {string}', (status) => {
  cy.goToTaskListPage();
  cy.checkStatusForTask('SiteOwnership', status);
});

Then('Access to the appeal site section is {string}', (status) => {
  cy.goToTaskListPage();
  cy.checkStatusForTask('SiteAccess', status);
});

Then('Health and Safety issues section is {string}', (status) => {
  cy.goToTaskListPage();
  cy.checkStatusForTask('HealthAndSafety', status);
});
