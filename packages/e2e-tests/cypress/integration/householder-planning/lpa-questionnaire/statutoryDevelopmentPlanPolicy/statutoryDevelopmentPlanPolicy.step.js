import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../../../../../../lpa-submissions-e2e-tests/cypress/utils/defaultPathId';

const page = {
  id: 'statutoryDevelopment',
  heading: 'Statutory development plan policy',
  section: 'Optional supporting documents',
  title: 'Statutory development plan policy - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'statutory-development',
}

let disableJs = false;

const goToStatutoryDevelopmentPlanPolicyPage = () => {
  cy.goToPage(page.url, undefined, disableJs);
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
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('Statutory development plan policy question is requested', () => {
  goToStatutoryDevelopmentPlanPolicyPage();
});

Then('LPA Planning Officer is presented with the ability to upload the statutory development plan policy', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('Statutory development plan policy subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then('Statutory development plan policy heading is shown and the uploaded file name should be displayed', () => {
  cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
