import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const pageTitle =
  'Upload report to reach decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const pageUrl = '/officers-report';
const sectionName = 'Required documents';
const validFileName = 'upload-file-valid.pdf';
const completedStatusId = 'officers-report';
const questionTitle = 'Planning Officer’s report';

Given('LPA Planning Officer is within the LPA Questionnaire task list', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Given('Upload the Planning Officers report is requested', () => {
  cy.goToPage(pageUrl);
  cy.verifyPage(pageUrl);
  cy.verifyPageTitle(pageTitle);
  cy.verifyQuestionTitle(questionTitle);
  cy.verifySectionName(sectionName);
});

Given('a file has been uploaded', () => {
  cy.goToPage(pageUrl);
  cy.clickChooseFile(validFileName);
  cy.clickUploadFile().click();
  cy.validateFileUpload(validFileName);
});

Given('a file has been uploaded and confirmed', () => {
  cy.goToPage(pageUrl);
  cy.clickChooseFile(validFileName);
  cy.clickUploadFile().click();
  cy.validateFileUpload(validFileName);
  cy.clickSaveAndContinue();
});

Given('The question "Upload the Planning Officers report" has been completed', () => {
  cy.goToPage(pageUrl);
  cy.clickChooseFile(validFileName);
  cy.clickUploadFile().click();
  cy.validateFileUpload(validFileName);
  cy.clickSaveAndContinue();
});

When('LPA Planning Officer deletes the file', () => {
  cy.deleteUploadedFile(validFileName);
});

When('a {string} is successfully uploaded', (fileName) => {
  cy.clickChooseFile(fileName);
  cy.clickUploadFile().click();
  cy.validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('a {string} is uploaded via drag and drop', (fileName) => {
  cy.clickChooseFile(fileName);
  cy.clickUploadFile().click();
  cy.validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('LPA Planning Officer selects the Upload the Planning Officers Report link', () => {
  cy.goToPage(pageUrl);
  cy.verifyPage(pageUrl);
});

When('no file has been uploaded', () => {
  cy.clickSaveAndContinue();
});

When('Back is then requested', () => {
  cy.clickBackButton();
});

When('valid {string} are uploaded', (fileNames) => {
  cy.uploadMultipleFiles(fileNames);
  cy.clickUploadFile().click();
  cy.clickSaveAndContinue();
});

When('files of {string} have been selected', (fileName) => {
  cy.clickChooseFile(fileName);
  cy.clickUploadFile().click();
  cy.validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('the Planning Officers report is requested', () => {
  cy.goToPage(pageUrl);
});

Then('the appeal details panel on the right hand side of the page can be viewed', () => {
  cy.verifyAppealDetailsSidebar({});
});

Then('the information they previously entered is still populated', () => {
  cy.validateFileUpload(validFileName);
});

Then('the file is removed', () => {
  cy.validateFileDeleted(validFileName);
});

Then('progress is halted with error message {string}', (errorMessage) => {
  cy.validateFileUploadErrorMessage(errorMessage);
});

Then('the Task list is presented', () => {
  cy.verifyTaskListPageTitle();
});

Then(
  'LPA Planning Officer is presented with the ability to upload the Planning Officers report',
  () => {
    cy.verifyPageTitle(pageTitle);
    cy.verifyQuestionTitle(questionTitle);
    cy.verifySectionName(sectionName);
  },
);

Then('progress is made to the Task List', () => {
  cy.verifyTaskListPageTitle();
});

Then(
  "upload the Planning Officer's report subsection is shown as completed",
  () => {
    cy.verifyCompletedStatus(completedStatusId);
  }
);
