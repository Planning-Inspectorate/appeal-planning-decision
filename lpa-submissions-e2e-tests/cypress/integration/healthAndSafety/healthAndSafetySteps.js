import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { textArea, input } from '../../support/PageObjects/common-page-objects';

const pageId = 'health-safety';
const pageTitle =
  'Are there any health and safety issues on the appeal site? - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Are there any health and safety issues on the appeal site?';
const taskListId = 'healthSafety';
const textAreaId = 'health-safety-text';
const noButtonId = 'has-health-safety-no';
const yesButtonId = 'has-health-safety-yes';

When(`the user selects the link 'Are there any health and safety issues on the appeal site?'`, () => {
  cy.goToPage(pageId);
  cy.verifyPageTitle(pageTitle);
});

Then(`the user is presented with the 'Are there any health and safety issues on the appeal site?' page`, () => {
  cy.verifyPageHeading(pageHeading);
  cy.checkPageA11y(pageId);
});

Then(
  `the Page title is 'Are there any health and safety issues on the appeal site? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'`,
  () => {
    cy.verifyPageTitle(pageTitle);
  },
);

Given(`user is in the health and safety page`, () => {
  cy.goToPage(pageId);
  cy.verifyPageTitle(pageTitle);
});

When(`user does not select an option`, () => {
  cy.verifyPageHeading(pageHeading);
});

When(`user selects Save and Continue`, () => {
  cy.clickSaveAndContinue();
});

Then(`user is shown an error message {string}`, (errorMessage) => {
  errorMessage === 'Select yes if there are health and safety issues'
    ? cy.validateErrorMessage(errorMessage, '[data-cy="health-safety-error"]', 'has-health-safety')
    : cy.validateErrorMessage(
        errorMessage,
        '[data-cy="health-safety-text-error"]',
        'health-safety-text',
      );
});

When(`user selects the option {string}`, (option) => {
  option === 'Yes' ? input(yesButtonId).check() : input(noButtonId).check();
});

Then('a Completed status is populated for the task', () => {
  cy.verifyCompletedStatus(taskListId);
});

When(`user enters {string}`, (health_safety) => {
  textArea(textAreaId).type(health_safety);
});

Given('user does not provide health and safety issues', () => {
  textArea(textAreaId).should('have.value', '');
});

When('user selects the back link', () => {
  cy.clickBackButton();
});

Then('any information they have entered will not be saved', () => {
  cy.clickOnSubTaskLink(taskListId);
  cy.verifyPageTitle(pageTitle);
  input(noButtonId).should('not.be.checked');
});

Given('a user has completed the information needed on the health and safety page', () => {
  cy.goToPage(pageId);
  input(noButtonId).check();
  cy.clickSaveAndContinue();
});

When('the user returns to the health and safety page from the Task List', () => {
  cy.clickOnSubTaskLink(taskListId);
  cy.verifyPageTitle(pageTitle);
});

Then('the information they previously entered is still populated', () => {
  input(noButtonId).should('be.checked');
});

When('an answer is saved', () => {
  input(noButtonId).check();
  cy.clickSaveAndContinue();
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('healthSafety', 'No');
});
