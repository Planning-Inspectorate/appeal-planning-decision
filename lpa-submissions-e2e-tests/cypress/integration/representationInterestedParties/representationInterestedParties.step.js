import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';

const appeal = require('../../fixtures/completedAppeal.json');

const page = {
  id: 'representationsInterestedParties',
  heading: `Representations from interested parties`,
  section: 'Optional supporting documents',
  title: `Representations from interested parties - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK`,
  url: 'representations',
}

let disableJs = false;

const goToInterestedPartiesPage = (appealId) => {
  cy.goToPage(page.url, appealId, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the Representations from Interested Parties question', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal);
  cy.get('@appealReply').then( (appealReply) => {
    goToInterestedPartiesPage(appealReply.appealId);
  });
});

Given('Representations from interested parties question is requested', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal);
  cy.get('@appealReply').then( (appealReply) => {
    goToInterestedPartiesPage(appealReply.appealId);
  });
});

When('LPA Planning Officer chooses to upload the document Representations from interested parties', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('the Representations from interested parties question is revisited', () => {
  cy.get('@appealReply').then( (appealReply) => {
    goToInterestedPartiesPage(appealReply.appealId);
  });
});

Then('LPA Planning Officer is presented with the ability to upload any documents relevant to the question Representations from interested parties', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.get('@appealReply').then( (appealReply) => {
    cy.checkPageA11y(`/${appealReply.appealId}/${page.url}`);
  });
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
