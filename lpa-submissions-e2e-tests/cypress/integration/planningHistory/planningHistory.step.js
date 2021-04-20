import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../utils/defaultPathId';

const preCannedAppeal = require('../../fixtures/anAppeal.json');

const page = {
  id: 'planningHistory',
  heading: 'Planning history',
  section: 'Optional supporting documents',
  title: 'Planning history - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'planning-history',
}

let disableJs = false;

const goToPlanningHistoryPage = (appealId) => {
  return cy.goToPage(page.url, appealId, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer has not added any data to the planning history question', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal);
});

Given('planning history question is requested', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal);
  cy.get('@appealReply').then( (appealReply) => {
    goToPlanningHistoryPage(appealReply.appealId);
  });
});

When('LPA Planning Officer chooses to upload the planning history', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('the planning history question is revisited', () => {
  cy.get('@appealReply').then( (appealReply) => {
    goToPlanningHistoryPage(appealReply.appealId);
  });
});

Then('LPA Planning Officer is presented with the ability to upload planning history', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.get('@appealReply').then( (appealReply) => {
    cy.checkPageA11y(`/${appealReply.appealId}/${page.url}`);
  });
});

Then('planning history subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then('planning history question heading is shown and the uploaded file name should be displayed', () => {
  cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
});
