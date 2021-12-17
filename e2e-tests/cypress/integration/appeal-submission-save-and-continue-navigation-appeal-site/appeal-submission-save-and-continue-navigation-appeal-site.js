import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the "Site location" is presented', () => {
  cy.goToSiteAddressPage();
});

Given('the "Site ownership" is presented', () => {
  cy.goToWholeSiteOwnerPage();
});

Given('the "Site ownership certb" is presented', () => {
  cy.goToOtherSiteOwnerToldPage();
});

Given('the "Site ownership" is not wholly owned', () => {
  cy.goToWholeSiteOwnerPage();

  cy.answerDoesNotOwnTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.userIsNavigatedToPage('/appellant-submission/site-ownership-certb');
});

Given('the "Site access" is presented', () => {
  cy.goToAccessSitePage();
});

Given('the "Site safety" is presented', () => {
  cy.goToHealthAndSafetyPage();
});

When('the "Site location" is submitted with valid values', () => {
  cy.provideAddressLine1('1 Taylor Road');
  cy.provideAddressLine2('Clifton');
  cy.provideTownOrCity('Bristol');
  cy.provideCounty('South Glos');
  cy.providePostcode('BS8 1TG');
  cy.clickSaveAndContinue();
});

When('the "Site ownership" is submitted with a YES value', () => {
  cy.answerOwnsTheWholeAppeal();
  cy.clickSaveAndContinue();
});

When('the "Site ownership" is submitted with a NO value', () => {
  cy.answerDoesNotOwnTheWholeAppeal();
  cy.clickSaveAndContinue();
});

When('the "Site ownership certb" is submitted with a YES value', () => {
  cy.answerHaveToldOtherOwnersAppeal();
  cy.clickSaveAndContinue();
});

When('the "Site ownership certb" is submitted with a NO value', () => {
  cy.answerHaveNotToldOtherOwnersAppeal();
  cy.clickSaveAndContinue();
});

When('the "Site access" is submitted with a YES value', () => {
  cy.answerCanSeeTheWholeAppeal();
  cy.clickSaveAndContinue();
});

When(
  'the "Site access" is submitted with a NO value and text about how access is restricted',
  () => {
    cy.answerCannotSeeTheWholeAppeal();
    cy.provideMoreDetails('More information');
    cy.clickSaveAndContinue();
  },
);

When(
  'the "Site safety" is submitted with a YES value and text about health and safety concerns',
  () => {
    cy.answerSiteHasNoIssues();
    cy.clickSaveAndContinue();
  },
);

When('the "Site safety" is submitted with a NO value', () => {
  cy.answerSiteHasIssues();
  cy.provideSafetyIssuesConcerns('There are some concerns...');
  cy.clickSaveAndContinue();
});
