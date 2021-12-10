import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { verifyPage } from '../../../../support/common/verifyPage';
import { getSubTaskInfo } from '../../../../support/common/subTasks';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { visibleWithText } from '../../../../support/common/visibleWithText';

const title =
  'Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const heading = 'Householder planning appeal questionnaire';
const url = '/task-list';

const verifyNotStartedStatus = (taskName) => {
  cy.get('li[' + taskName + '-status="NOT STARTED"]')
    .find('.govuk-tag')
    .contains('NOT STARTED');
};

/**
 * Steps
 * ----------------------------------------------
 */

Given(`The User clicks on {string}`, (taskRef) => {
  const { id, url } = getSubTaskInfo(taskRef) || {};

  clickOnSubTaskLink(id);
  verifyPage(url);
});

//When User clicks on Back button
When(`User clicks on Back button`, () => {
  cy.go('back');
});

Then(`The task {string} is available for selection`, (taskRef) => {
  const { id } = getSubTaskInfo(taskRef) || {};

  clickOnSubTaskLink(id);
});

Then(`The state for {string} is displayed to be "NOT STARTED"`, (taskRef) => {
  const { id } = getSubTaskInfo(taskRef) || {};

  verifyNotStartedStatus(id);
});

Then('the LPA Planning Officer is taken to the Task List', () => {
  verifyPage(url);
  verifyPageTitle(title);
  verifyPageHeading(heading);
  cy.checkPageA11y();
  visibleWithText(
    'Use the links below to submit your information. You can complete the sections in any order.',
    '.govuk-body-l',
  );
  visibleWithText(
    'Only include documents that were considered when making a decision on the application.',
    '[data-cy="task-list--optionalDocumentsSection"]',
  );
});

Then(
  'The state for "Before You submit - Check your answers" is displayed to be "CANNOT START YET"',
  () => {
    cy.get('li[name="checkYourAnswers"]')
      .find('.govuk-tag')
      .contains('CANNOT START YET');
  },
);

Then(
  'The "Only include documents that were considered when making a decision on the application." is displayed in Optional Supporting Documents',
  () => {
    visibleWithText(
      'Only include documents that were considered when making a decision on the application.',
      '[data-cy="task-list--optionalDocumentsSection"]',
    );
  },
);
