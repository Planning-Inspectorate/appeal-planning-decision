import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../../../../../../lpa-submissions-e2e-tests/cypress/utils/defaultPathId';

const page = {
  id: 'representationsInterestedParties',
  heading: `Representations from interested parties`,
  section: 'Optional supporting documents',
  title: `Representations from interested parties - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK`,
  url: 'representations',
}

let disableJs = false;

const goToRepresentationsPage = () => {
  cy.goToPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the Representations from Interested Parties question', () => {
  // No action needed as this is the default state
});

Given('Representations from interested parties question is requested', () => {
  goToRepresentationsPage();
});

When('LPA Planning Officer chooses to upload the document Representations from interested parties', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('the Representations from interested parties question is requested', () => {
  goToRepresentationsPage();
});

Then('LPA Planning Officer is presented with the ability to upload any documents relevant to the question Representations from interested parties', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('Representations from interested parties subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then('Representations from Interested parties heading and the uploaded file name should be displayed', () => {
  cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});

// TODO: move to shared file when AS-10 merged
Then('the status is not started', () => {
  cy.get(`li[${page.id}-status="NOT STARTED"]`)
    .find('.govuk-tag')
    .contains('NOT STARTED');
});
