import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';

const appeal = require('../../fixtures/completedAppeal.json');

const page = {
  id: 'interestedPartiesAppeal',
  heading: 'Notifying interested parties of the appeal',
  section: 'Optional supporting documents',
  title: 'Notifying interested parties of the appeal - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'notifications',
}

let disableJs = false;

const goToNotifyingPartiesPage = () => {
  cy.goToPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the Notifying interested parties of the appeal question', () => {
  cy.insertAppealAndCreateReply(appeal);
});

Given('Notifying interested parties of the appeal is requested', () => {
  cy.insertAppealAndCreateReply(appeal);
  cy.get('@appealReply').then( (appealReply) => {
    goToNotifyingPartiesPage(appealReply.appealId);
  });
});

When('LPA Planning Officer chooses to upload the document Notifying interested parties of the appeal', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('Notifying interested parties of the appeal is revisited', () => {
  cy.get('@appealReply').then( (appealReply) => {
    goToNotifyingPartiesPage(appealReply.appealId);
  });
});

Then('LPA Planning Officer is presented with the ability to upload any documents relevant to the question Notifying interested parties of the appeal', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.get('@appealReply').then( (appealReply) => {
    cy.checkPageA11y(`/${appealReply.appealId}/${page.url}`);
  });
});

Then('Notifying interested parties of the appeal subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then('Notifying interested parties of the appeal heading is shown and the uploaded file name should be displayed', () => {
  cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
