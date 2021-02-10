import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';

Given('access to the appeals service eligibility is available', () => {
  cy.goToLandingPage();
});

Given('the appeals householder planning permission question is requested', () => {
  cy.goToHouseholderQuestionPage();
});

When('the appeal service eligibility is accessed', () => {
  cy.goToHouseholderQuestionPage();
});

When('no confirmation is provided for householder planning permission question', () => {
  cy.clickSaveAndContinue();
});

When('confirmation is provided for householder planning permission question', () => {
  cy.provideHouseholderAnswerYes();
});

When('confirmation is not provided for householder planning permission question', () => {
  cy.provideHouseholderAnswerNo();
});

When('the \'What is householder planning permission\' additional information is accessed', () => {
  cy.accessDetails('details-householder');
});

Then('the appeals householder planning permission question is presented', () => {
  cy.confirmNavigationHouseholderQuestionPage();
});

Then('progress is halted with a message that a householder planning permission is required', () => {
  cy.confirmNavigationHouseholderQuestionPage();
  cy.confirmTextOnPage('No selection made: Select Yes if you applied for householder planning permission');
});

Then('progress is made to the eligibility decision date question', () => {
  cy.confirmNavigationDecisionDatePage();
});

Then('the user is navigated to the \'This service is only for householder planning appeals\' page', () => {
  cy.confirmNavigationHouseholderQuestionOutPage();
});

Then('access is available to ACP service', () => {
  cy.confirmAcpLinkDisplayed();
});

Then('the householder planning permission additional information is presented', () => {
  cy.confirmDetailsDisplayed('details-householder', 'What is householder planning permission?');
});
