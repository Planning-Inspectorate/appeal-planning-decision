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
  id: 'planningHistory',
  heading: 'Planning history',
  section: 'Optional supporting documents',
  title: 'Planning history - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'planning-history',
}

let disableJs = false;

const goToPlanningHistoryPage = () => {
  goToLPAPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the planning history question', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('planning history question is requested', () => {
  goToPlanningHistoryPage();
});

When('LPA Planning Officer chooses to upload the planning history', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('planning history question is requested', () => {
  goToPlanningHistoryPage();
});

Then('LPA Planning Officer is presented with the ability to upload planning history', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('planning history subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});

Then('planning history question heading is shown and the uploaded file name should be displayed', () => {
  confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
