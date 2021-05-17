import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../utils/defaultPathId';

const page = {
  id: 'otherRelevantPolicies',
  heading: 'Other relevant policies',
  section: 'Optional supporting documents',
  title:
    'Other relevant policies - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'other-policies',
};

let disableJs = false;

const goToOtherRelevantPoliciesPage = () => {
  cy.goToPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the other relevant policies question', () => {
  // This is empty as cypress default state results in this question holding no data
});

Given('other relevant policies question is requested', () => {
  goToOtherRelevantPoliciesPage();
});

When('LPA Planning Officer chooses to upload the other relevant policies', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('other relevant policies question is requested', () => {
  goToOtherRelevantPoliciesPage();
});

Then('LPA Planning Officer is presented with the ability to upload the policies', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('other relevant policies subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then(
  'other relevant policies question heading is shown and the uploaded file name should be displayed',
  () => {
    cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
