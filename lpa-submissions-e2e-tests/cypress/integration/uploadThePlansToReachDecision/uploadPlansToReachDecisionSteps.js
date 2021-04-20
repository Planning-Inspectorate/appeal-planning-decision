import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';
const documentServiceBaseURL = Cypress.env('DOCUMENT_SERVICE_BASE_URL');

const page = {
  id: 'plansDecision',
  heading: 'Upload the plans used to reach the decision',
  section: 'Required documents',
  title: 'Upload plans used to reach the decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'plans',
}

let disableJs = false;

const preCannedAppeal = require('../../fixtures/anAppeal.json');

const goToUploadDecisionPage = () => {
  cy.get('@appeal').then( (appeal) =>{
    cy.visit(`${appeal.id}/${path}`, { script: !disableJs });
  });
};

const clickUploadButton = () => {
  cy.get('[data-cy="upload-file"]').click();
};

/**
 * Steps
 * ----------------------------------------------
 */

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('Upload the plans used to reach the decision question is requested', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
  });
});

Given('a file has been uploaded', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
  });
});

Given('a file has been uploaded and confirmed', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
    validateFileUpload('upload-file-valid.pdf');
    cy.clickSaveAndContinue();
  });
});

Given('a file has been uploaded and confirmed And Upload the plans used to reach the decision question is requested', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
    validateFileUpload('upload-file-valid.pdf');
    cy.clickSaveAndContinue();
    goToUploadDecisionPage(appealReply.appealId);
  });
});

Given("The question 'Upload the plans used to reach the decision' has been completed", () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
    validateFileUpload('upload-file-valid.pdf');
    cy.clickSaveAndContinue();
  });
});

When('LPA Planning Officer chooses to upload plans used to reach the decision', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

Then('LPA Planning Officer is presented with the ability to upload plans', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('Upload the plans used to reach the decision subsection is shown as completed', () => {
  cy.verifyCompletedStatus('plansDecision');
});

Then('progress is halted with question error message {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage, '#documents-error', 'documents');
  cy.verifyPageTitle(`Error: ${pageTitle}`);
});

Then('progress is halted with file {string} error message {string}', (fileName, errorMessage) => {
  cy.validateErrorMessage(errorMessage, null, fileName);
  validateFileUpload(errorMessage);
  cy.verifyPageTitle(`Error: ${pageTitle}`);
});

Then('the file is removed', () => {
  validateFileDeleted('upload-file-valid.pdf');
  expectFileNotToBeInDocumentService('upload-file-valid.pdf');
});

Then('the information they previously entered is still populated', () => {
  validateFileUpload('upload-file-valid.pdf');
  expectFileToBeInDocumentService('upload-file-valid.pdf');
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.docx');
});
