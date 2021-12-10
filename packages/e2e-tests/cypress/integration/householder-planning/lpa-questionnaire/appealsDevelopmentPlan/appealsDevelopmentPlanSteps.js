import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { textArea, input } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import { validateErrorMessage } from '../../../../support/common/validateErrorMessage';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

const pageId = 'development-plan';
const pageTitle =
  'Development Plan Document or Neighbourhood Plan - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Development Plan Document or Neighbourhood Plan';
const taskListId = 'developmentOrNeighbourhood';
const textAreaId = 'plan-changes-text';
const noButtonId = 'has-plan-submitted-no';
const yesButtonId = 'has-plan-submitted-yes';

Given(`the Development Plan Document and Neighbourhood Plan question is requested`, () => {
  goToLPAPage(pageId);
  verifyPageTitle(pageTitle);
});

Given(`there is a Development Plan Document and Neighbourhood Plan`, () => {
  goToLPAPage(pageId);
  verifyPageTitle(pageTitle);
  input(yesButtonId).check();
});

Given(
  'the LPA Planning Officer has selected no and completed the Development Plan Document and Neighbourhood Plan question',
  () => {
    goToLPAPage(pageId);
    verifyPageTitle(pageTitle);
    input(noButtonId).check();
    clickSaveAndContinue();
  },
);

Given(
  'the LPA Planning Officer has selected yes, entered plan details, and completed the Development Plan Document and Neighbourhood Plan question',
  () => {
    goToLPAPage(pageId);
    verifyPageTitle(pageTitle);
    input(yesButtonId).check();
    textArea(textAreaId).type('some_text');
    clickSaveAndContinue();
  },
);

When(
  'the LPA Planning Officer chooses to provide information regarding the Development Plan and Neighbourhood Plan',
  () => {
    goToLPAPage(pageId);
    verifyPageTitle(pageTitle);
  },
);

When(`an answer is not provided`, () => {
  verifyPageHeading(pageHeading);
  clickSaveAndContinue();
});

When(`there is not a Development plan document or Neighbourhood plan`, () => {
  input(noButtonId).check();
  clickSaveAndContinue();
});

When(`details are provided about the plan {string}`, (plan_details) => {
  textArea(textAreaId).type(plan_details);
  clickSaveAndContinue();
});

When(`no details are given about the plan`, () => {
  textArea(textAreaId).should('have.value', '');
  clickSaveAndContinue();
});

When('the LPA Planning Officer chooses to go to the previous page', () => {
  getBackLink().click();
});

When(
  `the LPA Planning Officer returns to the Development Plan Document and Neighbourhood Plan question from the Task List`,
  () => {
    clickOnSubTaskLink(taskListId);
    verifyPageTitle(pageTitle);
  },
);

When('an answer is saved', () => {
  input(noButtonId).check();
  clickSaveAndContinue();
});

Then(`the LPA Planning Officer is presented with the ability to provide information`, () => {
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

Then(`progress is halted with an error message {string}`, (errorMessage) => {
  errorMessage === 'Select yes if there is a relevant Development Plan or Neighbourhood Plan'
    ? validateErrorMessage(
        errorMessage,
        '[data-cy="has-plan-submitted-error"]',
        'has-plan-submitted',
      )
    : validateErrorMessage(
        errorMessage,
        '[data-cy="plan-changes-text-error"]',
        'plan-changes-text',
      );
});

Then(`the Development Plan Document subsection is shown as completed`, () => {
  verifyCompletedStatus(taskListId);
});

Then('any information they have entered will not be saved', () => {
  clickOnSubTaskLink(taskListId);
  verifyPageTitle(pageTitle);
  input(yesButtonId).should('not.be.checked');
  input(noButtonId).should('not.be.checked');
  textArea(textAreaId).should('have.value', '');
});

Then('no is still selected', () => {
  input(noButtonId).should('be.checked');
});

Then('yes is still selected, and plan details are still populated', () => {
  input(yesButtonId).should('be.checked');
  textArea(textAreaId).should('have.value', 'some_text');
});

Then('the updated answer is displayed', () => {
  confirmCheckYourAnswersDisplayed('developmentOrNeighbourhood', 'No');
});
