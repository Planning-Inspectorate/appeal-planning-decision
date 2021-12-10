import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../../../../../../lpa-submissions-e2e-tests/cypress/utils/defaultPathId';

const page = {
  id: 'conservationAreaMap',
  heading: 'Conservation area map and guidance',
  section: 'Optional supporting documents',
  title: 'Conservation area map and guidance - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'conservation-area-map',
}

let disableJs = false;

const goToConservationAreaMapPage = () => {
  cy.goToPage(page.url, undefined, disableJs);
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
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('conservation area map question is requested', () => {
  goToConservationAreaMapPage();
});

Then('LPA Planning Officer is presented with the ability to upload conservation area map', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('conservation area map subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then('conservation area map question heading is shown and the uploaded file name should be displayed', () => {
  cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
