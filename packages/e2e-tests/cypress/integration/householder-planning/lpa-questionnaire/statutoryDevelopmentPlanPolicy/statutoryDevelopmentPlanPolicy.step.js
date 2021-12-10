import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
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

const page = {
  id: 'statutoryDevelopment',
  heading: 'Statutory development plan policy',
  section: 'Optional supporting documents',
  title: 'Statutory development plan policy - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'statutory-development',
}

let disableJs = false;

const goToStatutoryDevelopmentPlanPolicyPage = () => {
  goToPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the Statutory development plan policy', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('Statutory development plan policy is requested', () => {
  goToStatutoryDevelopmentPlanPolicyPage();
});

When('LPA Planning Officer chooses to upload Statutory development plan policy', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('Statutory development plan policy question is requested', () => {
  goToStatutoryDevelopmentPlanPolicyPage();
});

Then('LPA Planning Officer is presented with the ability to upload the statutory development plan policy', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('Statutory development plan policy subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});

Then('Statutory development plan policy heading is shown and the uploaded file name should be displayed', () => {
  confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
