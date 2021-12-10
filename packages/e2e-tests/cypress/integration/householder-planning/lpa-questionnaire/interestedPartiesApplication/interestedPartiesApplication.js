import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../../../../../../lpa-submissions-e2e-tests/cypress/utils/defaultPathId';

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
  cy.goToPage(page.url, undefined, disableJs);
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
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('interested parties application question is requested', () => {
  goToInterestedPartiesApplicationPage();
});

Then('LPA Planning Officer is presented with the ability to upload the interested parties application', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('interested parties application subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then(
  'interested parties application question heading is shown and the uploaded file name should be displayed',
  () => {
    cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
