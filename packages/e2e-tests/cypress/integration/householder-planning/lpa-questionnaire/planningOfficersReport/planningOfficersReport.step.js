import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import {defaultPathId} from '../../../../utils/defaultPathId';
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
  id: 'officersReport',
  heading: `Upload the Planning Officer's report`,
  section: 'Required documents',
  title: `Planning Officer's report - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK`,
  url: 'officers-report',
}

let disableJs = false;

const goToOfficersReportPage = () => {
  goToPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given("Upload the Planning Officer's report question is requested", () => {
  goToOfficersReportPage();
});

When('LPA Planning Officer chooses to upload Planning Officer report', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When("the Upload the Planning Officer's report question is requested", () => {
  goToOfficersReportPage();
});

Then("LPA Planning Officer is presented with the ability to upload the Planning Officer's report", () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then("Upload the Planning Officer's report subsection is shown as completed", () => {
  verifyCompletedStatus(page.id);
});

Then("Upload the Planning Officer's report heading and the uploaded file name should be displayed", () => {
  confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.pdf');
});
