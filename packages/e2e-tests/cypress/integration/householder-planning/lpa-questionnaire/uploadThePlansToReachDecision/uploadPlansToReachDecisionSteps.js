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
  id: 'plansDecision',
  heading: 'Upload the plans used to reach the decision',
  section: 'Required documents',
  title: 'Upload plans used to reach the decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'plans',
}

let disableJs = false;

const goToUploadDecisionPage = () => {
  goToPage(page.url, undefined, disableJs);
};

/**
 * Steps
 * ----------------------------------------------
 */

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('Upload the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

When('LPA Planning Officer chooses to upload plans used to reach the decision', () => {
  clickOnSubTaskLink(page.id);
  verifyPage(page.url);
});

When('the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

Then('LPA Planning Officer is presented with the ability to upload plans', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('Upload the plans used to reach the decision subsection is shown as completed', () => {
  verifyCompletedStatus(page.id);
});
