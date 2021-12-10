import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { textArea, input } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';
import { validateErrorMessage } from '../../../../support/common/validateErrorMessage';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

const page = {
  url: 'health-safety',
  id: 'healthSafety',
  heading: 'Are there any health and safety issues on the appeal site?',
  title:
    'Are there any health and safety issues on the appeal site? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  textAreaId: 'health-safety-text',
  noButtonId: 'has-health-safety-no',
  yesButtonId: 'has-health-safety-yes',
};

Before(() => {
  cy.wrap(page).as('page');
});

When(
  `the user selects the link 'Are there any health and safety issues on the appeal site?'`,
  () => {
    goToLPAPage(page.url);
    verifyPageTitle(page.title);
  },
);

Then(
  `the user is presented with the 'Are there any health and safety issues on the appeal site?' page`,
  () => {
    verifyPageHeading(page.heading);
    cy.checkPageA11y(page.url);
  },
);

Then(`the Page title is {string}`, (title) => {
  verifyPageTitle(page.title);
});

Given(`user is in the health and safety page`, () => {
  goToLPAPage(page.url);
  verifyPageTitle(page.title);
});

When(`user does not select an option`, () => {
  verifyPageHeading(page.heading);
});

When(`user selects Save and Continue`, () => {
  clickSaveAndContinue();
});

Then(`user is shown an error message {string}`, (errorMessage) => {
  errorMessage === 'Select yes if there are health and safety issues'
    ? validateErrorMessage(errorMessage, '[data-cy="health-safety-error"]', 'has-health-safety')
    : validateErrorMessage(
        errorMessage,
        '[data-cy="health-safety-text-error"]',
        'health-safety-text',
      );
});

When(`user selects the option {string}`, (option) => {
  option === 'Yes' ? input(page.yesButtonId).check() : input(page.noButtonId).check();
});

Then('a Completed status is populated for the task', () => {
  verifyCompletedStatus(page.id);
});

When(`user enters {string}`, (health_safety) => {
  textArea(page.textAreaId).type(health_safety);
});

Given('user does not provide health and safety issues', () => {
  textArea(page.textAreaId).should('have.value', '');
});

When('user selects the back link', () => {
  getBackLink().click();
});

Then('any information they have entered will not be saved', () => {
  clickOnSubTaskLink(page.id);
  verifyPageTitle(page.title);
  input(page.noButtonId).should('not.be.checked');
});

Given('a user has completed the information needed on the health and safety page', () => {
  goToLPAPage(page.url);
  input(page.noButtonId).check();
  clickSaveAndContinue();
});

When('the user returns to the health and safety page from the Task List', () => {
  clickOnSubTaskLink(page.id);
  verifyPageTitle(page.title);
});

Then('the information they previously entered is still populated', () => {
  input(page.noButtonId).should('be.checked');
});

When('an answer is saved', () => {
  input(page.noButtonId).check();
  clickSaveAndContinue();
});

Then('the updated answer is displayed', () => {
  confirmCheckYourAnswersDisplayed('healthSafety', 'No');
});
