import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

const page = {
  id: 'otherPolicies',
  heading: 'Other relevant policies',
  section: 'Optional supporting documents',
  title:
    'Other relevant policies - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'other-policies',
};

let disableJs = false;

const goToOtherRelevantPoliciesPage = () => {
  goToLPAPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the other relevant policies question', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('other relevant policies question is requested', () => {
  goToOtherRelevantPoliciesPage();
});

When('LPA Planning Officer chooses upload the other relevant policies', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('other relevant policies question is requested', () => {
  goToOtherRelevantPoliciesPage();
});

Then('LPA Planning Officer is presented with the ability to upload the policies', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('other relevant policies subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});

Then(
  'other relevant policies question heading is shown and the uploaded file name should be displayed',
  () => {
    confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
