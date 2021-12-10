import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../../../../../../lpa-submissions-e2e-tests/cypress/utils/defaultPathId';

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
  cy.goToPage(page.url, undefined, disableJs);
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
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('site notices question is requested', () => {
  goToSiteNoticesPage();
});

Then('LPA Planning Officer is presented with the ability to upload site notices', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading('Site notice');
  cy.verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('site notices subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then(
  'site notices question heading is shown and the uploaded file name should be displayed',
  () => {
    cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
