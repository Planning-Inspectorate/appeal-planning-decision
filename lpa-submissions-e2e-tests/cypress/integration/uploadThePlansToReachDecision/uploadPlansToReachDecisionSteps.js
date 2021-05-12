import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';

const appeal = require('../../fixtures/completedAppeal.json');

const page = {
  id: 'plansDecision',
  heading: 'Upload the plans used to reach the decision',
  section: 'Required documents',
  title: 'Upload plans used to reach the decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'plans',
}

let disableJs = false;

const goToUploadDecisionPage = (appealId) => {
  cy.goToPage(page.url, appealId, disableJs);
};

const clickUploadButton = () => {
  cy.get('[data-cy="upload-file"]').click();
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('LPA Planning Officer is presented with the ability to upload plans', () => {
  cy.insertAppealAndCreateReply(appeal);
  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
  });
});

Given('Upload the plans used to reach the decision question is requested', () => {
  cy.insertAppealAndCreateReply(appeal);
  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
  });
});

When('LPA Planning Officer chooses to upload plans used to reach the decision', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('the plans used to reach the decision question is revisited', () => {
  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
  });
});

Then('LPA Planning Officer is presented with the ability to upload plans', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.get('@appealReply').then( (appealReply) => {
    cy.checkPageA11y(`/${appealReply.appealId}/${page.url}`);
  });
});

Then('Upload the plans used to reach the decision subsection is shown as completed', () => {
  cy.verifyCompletedStatus('plansDecision');
});

Then('progress is halted with question error message {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage, '#documents-error', 'documents');
  cy.verifyPageTitle(`Error: ${pageTitle}`);
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.docx');
});
