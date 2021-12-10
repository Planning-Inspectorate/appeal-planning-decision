import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../../../../../../lpa-submissions-e2e-tests/cypress/utils/defaultPathId';

const page = {
  id: 'planningHistory',
  heading: 'Planning history',
  section: 'Optional supporting documents',
  title: 'Planning history - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'planning-history',
}

let disableJs = false;

const goToPlanningHistoryPage = () => {
  cy.goToPage(page.url, undefined, disableJs);
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
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('planning history question is requested', () => {
  goToPlanningHistoryPage();
});

Then('LPA Planning Officer is presented with the ability to upload planning history', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('planning history subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then('planning history question heading is shown and the uploaded file name should be displayed', () => {
  cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
