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
  id: 'interestedPartiesApplication',
  heading: 'Telling interested parties about the application',
  section: 'Optional supporting documents',
  title:
    'Telling interested parties about the application - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'interested-parties',
};

let disableJs = false;

const goToInterestedPartiesApplicationPage = () => {
  goToLPAPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the interested parties application question', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('interested parties application question is requested', () => {
  goToInterestedPartiesApplicationPage();
});

When('LPA Planning Officer chooses upload the interested parties application', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('interested parties application question is requested', () => {
  goToInterestedPartiesApplicationPage();
});

Then('LPA Planning Officer is presented with the ability to upload the interested parties application', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('interested parties application subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});

Then(
  'interested parties application question heading is shown and the uploaded file name should be displayed',
  () => {
    confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
