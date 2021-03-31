import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  textBox,
  labelText,
  labelHint,
  input,
} from '../../support/PageObjects/common-page-objects';

const pageId = 'other-appeals';
const pageTitle =
  'Are there any other appeals adjacent or close to the site still being considered? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const pageHeading =
  'Are there any other appeals adjacent or close to the site still being considered?';
const taskListId = 'otherAppeals';
const textBoxId = 'appeal-reference-numbers';
const labelHintId = 'appeal-reference-numbers-hint';
const labelTextId = 'appeal-reference-numbers-label';
const noButtonId = 'adjacent-appeals-no';
const yesButtonId = 'adjacent-appeals-yes';

Given('The Householder planning appeal questionnaire page is presented', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Given('the user is on the Tell us about any appeals in the immediate area page', () => {
  cy.goToPage(pageId);
  cy.verifyPageTitle(pageTitle);
  cy.verifyPageHeading(pageHeading);
});

When(`the user selects the link Tell us about any appeals in the immediate area`, () => {
  cy.goToAppealsQuestionnaireTasklistPage();
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage(taskListId);
});

When(`the user selects Save and Continue`, () => {
  cy.clickSaveAndContinue();
});

Then('the user is presented with the Immediate Area page', () => {
  cy.verifyPageTitle(pageTitle);
});

Then(`the user remains on 'Tell us about any appeals in the immediate area' page`, () => {
  cy.verifyPage(pageId);
});

When('the user selects the option {string}', (option) => {
  option === 'Yes' ? input(yesButtonId).check() : input(noButtonId).check();
});

Then('the user navigates to the Task List', () => {
  cy.verifyTaskListPageTitle();
});

Then('a Completed status is populated for the task', () => {
  cy.verifyCompletedStatus(taskListId);
});

Then('the user is provided with a free text field to input the appeal reference numbers', () => {
  labelHint(labelHintId)
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('You can enter more than one, separated by commas');
    });
  labelText(labelTextId)
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Enter appeal reference number(s)');
    });
  textBox(textBoxId);
});

When(`the user enters {string}`, (appeal_reference_number) => {
  textBox(textBoxId).type(appeal_reference_number);
});

When('user does not provide appeal reference numbers', () => {
  textBox(textBoxId).should('have.value', '');
});

Then('the user is shown the error message {string}', (errorMessage) => {
  errorMessage === 'Select yes if there are other appeals still being considered'
    ? cy.validateErrorMessage(errorMessage, 'adjacent-appeals-error', 'adjacent-appeals')
    : cy.validateErrorMessage(
        errorMessage,
        'appeal-reference-numbers-error',
        'appeal-reference-numbers',
      );
});

Given('a user has completed the information needed on the appeals in immediate area page', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
  cy.verifyTaskListPageTitle();
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage(taskListId);
  cy.verifyPage(pageId);
  input(noButtonId).check();
  cy.clickSaveAndContinue();
});

When(
  `the user returns to the 'Tell us about any appeals in the immediate area' page from the Task List`,
  () => {
    cy.verifyTaskListPageTitle();
    cy.clickOnLinksOnAppealQuestionnaireTaskListPage(taskListId);
    cy.verifyPage(pageId);
  },
);

Then('the information they previously entered is still populated', () => {
  input(noButtonId).should('be.checked');
});

When('the user selects the back link', () => {
  cy.clickBackButton();
});

Then('any information they have entered will not be saved', () => {
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage(taskListId);
  cy.verifyPage(pageId);
  input(noButtonId).should('not.be.checked');
});
