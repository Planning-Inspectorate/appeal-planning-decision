import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../utils/defaultPathId';

const pageTitle =
  'Upload plans used to reach the decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const pageUrl = '/plans';
const path = `/${defaultPathId}/plans`;

let disableJs = false;

const goToUploadDecisionPage = () => {
  cy.visit(path, { script: !disableJs });
};

const clickUploadButton = () => {
  cy.get('[data-cy="upload-file"]').click();
};

const uploadFiles = (fileName, dropZone) => {
  // start watching the POST requests
  cy.server({ method: 'POST' });
  cy.route({
    method: 'POST',
    url: disableJs ? /plans/ : /upload/,
  }).as('upload');

  const target = () => {
    return dropZone ? cy.get('.moj-multi-file-upload__dropzone') : cy.get('input#documents');
  };

  target().attachFile(
    Array.isArray(fileName) ? fileName : [fileName],
    dropZone ? { subjectType: 'drag-n-drop' } : null,
  );

  if (disableJs) {
    clickUploadButton();
  } else {
    cy.wait('@upload', { requestTimeout: 3000 });
  }
  cy.server({ enable: false });
};

const deleteFile = () => {
  cy.get(`.moj-multi-file-upload__delete`).click();
};

const validateFileUpload = (fileName) => {
  cy.visibleWithText(fileName, '.govuk-summary-list__row');
};

const validateFileDeleted = (fileName) => {
  cy.visibleWithoutText(fileName, '.moj-multi-file-upload__list');
};

/**
 * Steps
 * ----------------------------------------------
 */

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

After({ tags: '@nojs' }, () => {
  disableJs = false;
});

Given('Upload the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

Given('a file has been uploaded', () => {
  goToUploadDecisionPage();
  uploadFiles('upload-file-valid.pdf');
});

Given('a file has been uploaded and confirmed', () => {
  goToUploadDecisionPage();
  uploadFiles('upload-file-valid.pdf');
  validateFileUpload('upload-file-valid.pdf');
  cy.clickSaveAndContinue();
});

Given("The question 'Upload the plans used to reach the decision' has been completed", () => {
  goToUploadDecisionPage();
  uploadFiles('upload-file-valid.pdf');
  validateFileUpload('upload-file-valid.pdf');
  cy.clickSaveAndContinue();
});

When('LPA Planning Officer chooses to upload plans used to reach the decision', () => {
  cy.clickOnSubTaskLink('plansDecision');
  cy.verifyPage(pageUrl);
});

When('valid file {string} is successfully uploaded', (fileName) => {
  uploadFiles(fileName);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('valid file {string} is uploaded via drag and drop', (fileName) => {
  uploadFiles(fileName, true);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('valid multiple files {string} are uploaded', (fileNames) => {
  uploadFiles(fileNames.split(', '));
  cy.clickSaveAndContinue();
});

When('no file has been uploaded', () => {
  cy.clickSaveAndContinue();
});

When('invalid files {string} have been selected', (fileName) => {
  uploadFiles(fileName);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('Back is then requested', () => {
  cy.clickBackButton();
});

When('LPA Planning Officer deletes the file', () => {
  deleteFile('upload-file-valid.pdf');
});

When('the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

When('an answer is saved', () => {
  const fileName = 'upload-file-valid.docx';
  uploadFiles(fileName);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

Then('LPA Planning Officer is presented with the ability to upload plans', () => {
  cy.verifyPage(pageUrl);
  cy.verifyPageTitle(pageTitle);
  cy.verifyPageHeading('Upload the plans used to reach the decision');
  cy.verifySectionName('Required documents');
  cy.checkPageA11y(path);
});

Then('Upload the plans used to reach the decision subsection is shown as completed', () => {
  cy.verifyCompletedStatus('plansDecision');
});

Then('progress is halted with question error message {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage, '#documents-error', 'documents');
});

Then('progress is halted with file {string} error message {string}', (fileName, errorMessage) => {
  cy.validateErrorMessage(errorMessage, null, fileName);
  validateFileUpload(errorMessage);
});

Then('the file is removed', () => {
  validateFileDeleted('upload-file-valid.pdf');
});

Then('the information they previously entered is still populated', () => {
  validateFileUpload('upload-file-valid.pdf');
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.docx');
});
