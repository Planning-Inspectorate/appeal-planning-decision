import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import {defaultPathId} from '../../../../utils/defaultPathId';
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
  id: 'siteNotices',
  heading: 'Site notices',
  section: 'Optional supporting documents',
  title:
    'Site notice or local advertisement - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'site-notice',
};

let disableJs = false;

const goToSiteNoticesPage = () => {
  goToLPAPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the site notices question', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('site notices question is requested', () => {
  goToSiteNoticesPage();
});

When('LPA Planning Officer chooses to upload the site notices', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('site notices question is requested', () => {
  goToSiteNoticesPage();
});

Then('LPA Planning Officer is presented with the ability to upload site notices', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading('Site notice');
  verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('site notices subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});

Then(
  'site notices question heading is shown and the uploaded file name should be displayed',
  () => {
    confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
