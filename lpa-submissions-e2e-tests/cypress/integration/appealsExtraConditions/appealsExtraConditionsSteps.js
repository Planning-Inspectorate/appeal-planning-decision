import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given(`the householder planning appeal questionnaire task list is presented`, () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

When(`the user selects the link 'Do you have any extra conditions?'`, () => {
  cy.goToExtraConditionsPage();
  cy.validateExtraConditionsPageTitle();
});

Then(`the user is presented with the 'Do you have any extra conditions?' page`, () => {
  cy.validateExtraConditionsPageHeading();
});

Then(
  `the Page title is 'Do you have any extra conditions? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'`,
  () => {
    cy.validateExtraConditionsPageTitle();
  },
);

Given(`user is in the extra conditions page`, () => {
  cy.goToAppealsQuestionnaireTasklistPage();
  cy.goToExtraConditionsPage();
  cy.validateExtraConditionsPageTitle();
});

When(`user does not select an option`, () => {
  cy.validateExtraConditionsPageHeading();
});

When(`user selects Save and Continue`, () => {
  cy.clickSaveAndContinue();
});

Then(`user is shown an error message {string}`, (errorMessage) => {
  cy.validateExtraConditionsErrorMessage(errorMessage);
});

Then(`the user remains on extra conditions page`, () => {
  cy.validateExtraConditionsPageTitle();
});

When(`user selects the option {string}`, (option) => {
  cy.extraConditionsRadioButton(option).check();
});

Then('user navigates to the Task List', () => {
  cy.verifyTaskListPageTitle();
});

Then('a Completed status is populated for the task', () => {
  cy.verifyCompletedStatus('extraConditions');
});

When(`user enters {string}`, (extra_information) => {
  cy.inputExtraConditionsExtraInformation().type(extra_information);
});

Given('user does not provide extra information', () => {
  cy.inputExtraConditionsExtraInformation().should('have.value', '');
});

When('user selects the back link', () => {
  cy.clickBackButton();
});

Then('any information they have entered will not be saved', () => {
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('extraConditions');
  cy.validateExtraConditionsPageTitle();
  cy.extraConditionsRadioButton('No').should('not.be.checked');
});

Given('a user has completed the information needed on the extra conditions page', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
  cy.verifyTaskListPageTitle();
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('extraConditions');
  cy.validateExtraConditionsPageTitle();
  cy.extraConditionsRadioButton('No').check();
  cy.clickSaveAndContinue();
});

When('the user returns to the extra conditions page from the Task List', () => {
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('extraConditions');
  cy.validateExtraConditionsPageTitle();
});

Then('the information they previously entered is still populated', () => {
  cy.extraConditionsRadioButton('No').should('be.checked');
});
