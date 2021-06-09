import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { input, labelText, labelLegend } from '../../support/PageObjects/common-page-objects';

const pageId = 'accuracy-submission';
const pageTitle =
  "Review accuracy of appellant's submission - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK";
const taskListId = 'submissionAccuracy';
const noButtonId = 'accurate-submission-no';
const yesButtonId = 'accurate-submission-yes';
const taskListUrl = '/task-list';
const inaccuracyReasonInputId = 'inaccuracy-reason';
const accurateSubmissionLabelId = 'accurate-submission-label';
const sectionName = 'About the appeal';

Given(`the user is in the Review accuracy of the appellant's submission page`, () => {
  cy.goToPage(pageId);
  cy.verifyPageTitle(pageTitle);
});

Given(
  `a user has completed the information needed on the accuracy of the appellant's submission page`,
  () => {
    cy.goToPage(pageId);
    input(yesButtonId).check();
    cy.clickSaveAndContinue();
  },
);

When(`the user selects the link "Review accuracy of the appellant's submission"`, () => {
  cy.clickOnSubTaskLink(taskListId);
});

When('the user does not select an option', () => {
  input(yesButtonId).should('not.be.checked');
  input(noButtonId).should('not.be.checked');
});

When(`the user selects Save and Continue`, () => {
  cy.clickSaveAndContinue();
});

When('the user selects {string}', (radioValue) => {
  radioValue === 'Yes' ? input(yesButtonId).check() : input(noButtonId).check();
});

When('the user enters {string}', (inaccuracyReason) => {
  labelText(inaccuracyReasonInputId).type(inaccuracyReason);
});

When('the user has not provided further information as text regarding their reasons', () => {
  labelText(inaccuracyReasonInputId).should('have.value', '');
});

When('the user selects the back link', () => {
  cy.clickBackButton();
});

When('the user returns to the submission accuracy page from the Task List', () => {
  cy.verifyPage(taskListUrl);
  cy.clickOnSubTaskLink(taskListId);
  cy.verifyPage(pageId);
});

When('an answer is saved', () => {
  input(yesButtonId).check();
  cy.clickSaveAndContinue();
});

Then('the user is presented with the correct page', () => {
  cy.verifySectionName(sectionName);
  cy.verifyPageTitle(pageTitle);
  cy.checkPageA11y(pageId);
});

Then('the radio group label is {string}', (label) => {
  labelLegend(accurateSubmissionLabelId)
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(label);
    });
});

Then('the user is shown the error message {string}', (errorMessage) => {
  errorMessage === 'Select yes if the information accurately reflects the planning application'
    ? cy.validateErrorMessage(
        errorMessage,
        '[data-cy="accurate-submission-error"]',
        'accurate-submission',
      )
    : cy.validateErrorMessage(
        errorMessage,
        '[data-cy="inaccuracy-reason-error"]',
        'inaccuracy-reason',
      );
});

Then('a Completed status is populated on that sub-section of the task list', () => {
  cy.verifyCompletedStatus(taskListId);
});

Then('the user is provided with a free text field to input their reasons', () => {
  labelText(inaccuracyReasonInputId).should('be.visible');
});

Then('any information they have inputted will not be saved', () => {
  cy.clickOnSubTaskLink(taskListId);
  cy.verifyPageTitle(pageTitle);
  input(noButtonId).should('not.be.checked');
});

Then('the information they previously entered is still populated', () => {
  input(yesButtonId).should('be.checked');
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('submissionAccuracy', 'Yes');
});
