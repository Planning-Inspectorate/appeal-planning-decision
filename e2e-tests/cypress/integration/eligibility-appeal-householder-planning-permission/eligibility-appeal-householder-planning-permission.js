import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('access to the appeals service eligibilty is available', () => {
  // same step ???
  // cy.goToStartAppealPage(); // - but this page doesn't exist?
  // click a button to start the process?
  // see the right URL ?
});

Given('the appeals householder planning permission question is requested', () => {
  // same step ???
  // difference between requested and presented ?
  cy.goToHouseholderPlanningPermissionQuestionPage();
});

Given('the user is on the “This service is only for householder planning appeals” page', () => {
  cy.goToHouseholderPlanningPermissionQuestionPage();
  cy.confirmationProvidedForHouseholderPlanningPermissionQuestion(true);
});

Given('the appeals householder planning permission question is presented', () => {
  // same step ???
  // difference between presented and requested ?
  cy.goToHouseholderPlanningPermissionQuestionPage();
});

When('the appeal service eligibility is accessed', () => {
  // same step ???
  // is this different to 'GIVEN access to the appeals service eligibilty is available' ?
  cy.goToHouseholderPlanningPermissionQuestionPage();
});

When('no confirmation is provided for householder planning permission question', () => {
  cy.confirmationProvidedForHouseholderPlanningPermissionQuestion(undefined);
});

When('confirmation is provided for householder planning permission question', () => {
  cy.confirmationProvidedForHouseholderPlanningPermissionQuestion(true);
});

When('confirmation is not provided for householder planning permission question', () => {
  cy.confirmationProvidedForHouseholderPlanningPermissionQuestion(false);
});

When('user confirms to appeal using the ACP service', () => {
  cy.userConfirmsToAppealUsingACPService();
});

When('the "What is householder planning permission" additional information is accessed', () => {
  cy.clickWhatIsHouseholderPlanningPermissionAdditionalInformation();
});

Then('the appeals householder planning permission question is presented', () => {
  cy.confirmAppealsHouseholderPlanningPermissionQuestionIsPresented();
});

Then('progress is halted with a message that a householder planning permission is required', () => {
  cy.confirmProgressHaltedBecausePlanningPermissionIsRequired();
});

Then('progress is made to the eligibility decision date question', () => {
  cy.confirmProgressIsMadeToEligibilityDecisionDateQuestion();
});

Then(
  'the user is navigated to the “This service is only for householder planning appeals” page',
  () => {
    cy.confirmUserIsNavigatedToThisServiceIsOnlyForHouseholderPlanningAppealsPage();
  },
);

Then('access is available to ACP service', () => {
  cy.confirmAccessIsAvailableToACPService();
});

Then('the householder planning permission additional information is presented', () => {
  cy.confirmHouseholderPlanningPermissionAdditionalInformationIsPresented();
});
