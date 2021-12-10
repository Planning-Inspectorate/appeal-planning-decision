import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  textBox,
  labelText,
  labelHint,
  input,
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { verifyPage } from '../../../../support/common/verifyPage';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import { validateErrorMessage } from '../../../../support/common/validateErrorMessage';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import {
  goToTaskListPage
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/goToTaskListPage';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';

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

Given('the user is on the Tell us about any appeals in the immediate area page', () => {
  goToPage(pageId);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});

When(`the user selects the link Tell us about any appeals in the immediate area`, () => {
  goToTaskListPage();
  clickOnSubTaskLink(taskListId);
});

When(`the user selects Save and Continue`, () => {
  clickSaveAndContinue();
});

Then('the user is presented with the Immediate Area page', () => {
  verifyPageTitle(pageTitle);
  cy.checkPageA11y(pageId);
});

Then(`the user remains on 'Tell us about any appeals in the immediate area' page`, () => {
  verifyPage(pageId);
});

When('the user selects the option {string}', (option) => {
  option === 'Yes' ? input(yesButtonId).check() : input(noButtonId).check();
});

Then('a Completed status is populated for the task', () => {
  verifyCompletedStatus(taskListId);
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
    ? validateErrorMessage(
        errorMessage,
        '[data-cy="adjacent-appeals-error"]',
        'adjacent-appeals',
      )
    : validateErrorMessage(
        errorMessage,
        '[data-cy="appeal-reference-numbers-error"]',
        'appeal-reference-numbers',
      );
});

Given('a user has completed the information needed on the appeals in immediate area page', () => {
  goToPage(pageId);
  input(noButtonId).check();
  clickSaveAndContinue();
});

When(
  `the user returns to the 'Tell us about any appeals in the immediate area' page from the Task List`,
  () => {
    clickOnSubTaskLink(taskListId);
    verifyPage(pageId);
  },
);

Then('the information they previously entered is still populated', () => {
  input(noButtonId).should('be.checked');
});

When('the user selects the back link', () => {
  getBackLink().click();
});

Then('any information they have entered will not be saved', () => {
  clickOnSubTaskLink(taskListId);
  verifyPage(pageId);
  input(noButtonId).should('not.be.checked');
});

When('an answer is saved', () => {
  input(noButtonId).check();
  clickSaveAndContinue();
});

Then('the updated answer is displayed', () => {
  confirmCheckYourAnswersDisplayed('otherAppeals', 'No');
});
