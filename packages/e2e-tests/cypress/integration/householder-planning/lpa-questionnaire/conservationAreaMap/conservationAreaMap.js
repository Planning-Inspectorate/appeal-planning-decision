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
  id: 'conservationAreaMap',
  heading: 'Conservation area map and guidance',
  section: 'Optional supporting documents',
  title: 'Conservation area map and guidance - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'conservation-area-map',
}

let disableJs = false;

const goToConservationAreaMapPage = () => {
  goToPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the conservation area map question', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('conservation area map question is requested', () => {
  goToConservationAreaMapPage();
});

When('LPA Planning Officer chooses to upload the conservation area map', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('conservation area map question is requested', () => {
  goToConservationAreaMapPage();
});

Then('LPA Planning Officer is presented with the ability to upload conservation area map', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('conservation area map subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});

Then('conservation area map question heading is shown and the uploaded file name should be displayed', () => {
  confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
