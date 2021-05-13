import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('an answer to the Costs question is requested', () => {
  cy.goToCostsPage();
});

Given('an Appeal exists', () => {
  cy.goToTaskListPage();
});

When('not claiming Costs is confirmed', () => {
  cy.provideCostsAnswerNo();
  cy.clickSaveAndContinue();
});

When('claiming Costs is confirmed', () => {
  cy.provideCostsAnswerYes();
  cy.clickSaveAndContinue();
});

When('the Costs question is not answered', () => {
  cy.clickSaveAndContinue();
});

Then('progress is made to Your appeal statement', () => {
  cy.confirmNavigationYourAppealStatementPage();
});

Then('progress is halted with a message that claiming for Costs is not supported', () => {
  cy.confirmNavigationCostsOutPage();
  cy.confirmTextOnPage('This service is not available if you are claiming costs');
});

Then('progress is halted with a message that an answer to the Costs question is required', () => {
  cy.confirmNavigationCostsPage();
  cy.confirmTextOnPage('Select yes if you are claiming for costs as part of your appeal');
  cy.title().should('match', /^Error: /);
  //Accessibility Testing
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
});

Then(
  'access is available to guidance while an answer to the Costs question is still requested',
  () => {
    cy.confirmGuidanceLinkDisplayed();
  },
);

Then('access is available to ACP', () => {
  cy.confirmAcpLinkDisplayed();
});
