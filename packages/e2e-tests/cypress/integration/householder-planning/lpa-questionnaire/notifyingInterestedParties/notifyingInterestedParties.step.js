import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import {defaultPathId} from '../../../../utils/defaultPathId';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import {
  verifyCompletedStatus
} from '../../../../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

const page = {
  id: 'interestedPartiesAppeal',
  heading: 'Notifying interested parties of the appeal',
  section: 'Optional supporting documents',
  title: 'Notifying interested parties of the appeal - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'notifications',
}

let disableJs = false;

const goToNotifyingPartiesPage = () => {
  goToLPAPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the Notifying interested parties of the appeal question', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('Notifying interested parties of the appeal is requested', () => {
  goToNotifyingPartiesPage();
});

When('LPA Planning Officer chooses to upload the document Notifying interested parties of the appeal', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('Notifying interested parties of the appeal is requested', () => {
  goToNotifyingPartiesPage();
});

Then('LPA Planning Officer is presented with the ability to upload any documents relevant to the question Notifying interested parties of the appeal', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('Notifying interested parties of the appeal subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});

Then('Notifying interested parties of the appeal heading is shown and the uploaded file name should be displayed', () => {
  confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
