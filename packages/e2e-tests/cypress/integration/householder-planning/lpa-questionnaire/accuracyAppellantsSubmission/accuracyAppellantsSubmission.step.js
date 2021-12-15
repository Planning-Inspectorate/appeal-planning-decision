import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { input, labelText, labelLegend } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import { validateErrorMessage } from '../../../../support/common/validateErrorMessage';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

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
 goToLPAPage(pageId);
  verifyPageTitle(pageTitle);
});

Given(
  `a user has completed the information needed on the accuracy of the appellant's submission page`,
  () => {
    goToLPAPage(pageId);
    input(yesButtonId).check();
    clickSaveAndContinue();
  },
);

When(`the user selects the link "Review accuracy of the appellant's submission"`, () => {
  clickOnSubTaskLink(taskListId);
});

When('the user does not select an option', () => {
  input(yesButtonId).should('not.be.checked');
  input(noButtonId).should('not.be.checked');
});

When(`the user selects Save and Continue`, () => {
  clickSaveAndContinue();
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
  getBackLink().click();
});

When('the user returns to the submission accuracy page from the Task List', () => {
  verifyPage(taskListUrl);
  clickOnSubTaskLink(taskListId);
  verifyPage(pageId);
});

When('an answer is saved', () => {
  input(yesButtonId).check();
  clickSaveAndContinue();
});

Then('the user is presented with the correct page', () => {
  verifySectionName(sectionName);
  verifyPageTitle(pageTitle);
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
    ? validateErrorMessage(
        errorMessage,
        '[data-cy="accurate-submission-error"]',
        'accurate-submission',
      )
    : validateErrorMessage(
        errorMessage,
        '[data-cy="inaccuracy-reason-error"]',
        'inaccuracy-reason',
      );
});

Then('a Completed status is populated on that sub-section of the task list', () => {
  verifyCompletedStatus(taskListId);
});

Then('the user is provided with a free text field to input their reasons', () => {
  labelText(inaccuracyReasonInputId).should('be.visible');
});

Then('any information they have inputted will not be saved', () => {
  clickOnSubTaskLink(taskListId);
  verifyPageTitle(pageTitle);
  input(noButtonId).should('not.be.checked');
});

Then('the information they previously entered is still populated', () => {
  input(yesButtonId).should('be.checked');
});

Then('the updated answer is displayed', () => {
  confirmCheckYourAnswersDisplayed('submissionAccuracy', 'Yes');
});
