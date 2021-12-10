import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { textArea, input } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';
import { validateErrorMessage } from '../../../../support/common/validateErrorMessage';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

const pageId = 'extra-conditions';
const pageTitle =
  'Do you have any extra conditions? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Do you have any extra conditions?';
const taskListId = 'extraConditions';
const textAreaId = 'extra-conditions-text';
const noButtonId = 'has-extra-conditions-no';
const yesButtonId = 'has-extra-conditions-yes';

When(`the user selects the link 'Do you have any extra conditions?'`, () => {
  goToLPAPage(pageId);
  verifyPageTitle(pageTitle);
});

Then(`the user is presented with the 'Do you have any extra conditions?' page`, () => {
  verifyPageHeading(pageHeading);
  cy.checkPageA11y(pageId);
});

Then(
  `the Page title is 'Do you have any extra conditions? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'`,
  () => {
    verifyPageTitle(pageTitle);
  },
);

Given(`user is in the extra conditions page`, () => {
  goToLPAPage(pageId);
  verifyPageTitle(pageTitle);
});

When(`user does not select an option`, () => {
  verifyPageHeading(pageHeading);
});

When(`user selects Save and Continue`, () => {
  clickSaveAndContinue();
});

Then(`user is shown an error message {string}`, (errorMessage) => {
  errorMessage === 'Select yes if you have extra conditions'
    ? validateErrorMessage(
        errorMessage,
        '[data-cy="extra-conditions-error"]',
        'has-extra-conditions',
      )
    : validateErrorMessage(
        errorMessage,
        '[data-cy="extra-conditions-text-error"]',
        'extra-conditions-text',
      );
});

When(`user selects the option {string}`, (option) => {
  option === 'Yes' ? input(yesButtonId).check() : input(noButtonId).check();
});

Then('a Completed status is populated for the task', () => {
  verifyCompletedStatus(taskListId);
});

When(`user enters {string}`, (extra_information) => {
  textArea(textAreaId).type(extra_information);
});

Given('user does not provide extra information', () => {
  textArea(textAreaId).should('have.value', '');
});

When('user selects the back link', () => {
  getBackLink().click();
});

Then('any information they have entered will not be saved', () => {
  clickOnSubTaskLink(taskListId);
  verifyPageTitle(pageTitle);
  input(noButtonId).should('not.be.checked');
});

Given('a user has completed the information needed on the extra conditions page', () => {
  goToLPAPage(pageId);
  input(noButtonId).check();
  clickSaveAndContinue();
});

When('the user returns to the extra conditions page from the Task List', () => {
  clickOnSubTaskLink(taskListId);
  verifyPageTitle(pageTitle);
});

Then('the information they previously entered is still populated', () => {
  input(noButtonId).should('be.checked');
});

When('an answer is saved', () => {
  input(noButtonId).check();
  clickSaveAndContinue();
});

Then('the updated answer is displayed', () => {
  confirmCheckYourAnswersDisplayed('extraConditions', 'No');
});
