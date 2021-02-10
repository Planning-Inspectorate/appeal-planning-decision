import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('receipt of an Enforcement Notice is requested', () => {
  cy.goToEnforcementNoticePage();
});

When('receipt of an Enforcement Notice is not provided', () => {
  cy.provideEnforcementNoticeAnswer(undefined);
});

When('the appellant has received an Enforcement Notice', () => {
  cy.provideEnforcementNoticeAnswer(true);
});

When('the appellant has not received an Enforcement Notice', () => {
  cy.provideEnforcementNoticeAnswer(false);
});

Then('progress is halted with a message that the Enforcement Notice question is required', () => {
  cy.confirmThatEnforcementNoticeAnswerIsRequired();
});

Then(
  'progress is halted with a message that this service is only for householder planning appeals',
  () => {
    cy.confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals();
  },
);

Then('progress is made to the Listed Building eligibility question', () => {
  cy.confirmProgressIsMadeToListingBuildingEligibilityQuestion();
});
