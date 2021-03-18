import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const pageTitle = 'Upload plans used to reach the decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'
const pageUrl = '/plans'
Given('LPA Planning Officer is reviewing their LPA Questionnaire task list', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Given('Upload the plans used to reach the decision question is requested', () => {
  cy.goToUploadThePlansUsedToReachDecisionPage();
  cy.verifyPage(pageUrl);
  cy.verifyPageTitle(pageTitle);
  cy.verifyQuestionTitle('Upload the plans used to reach the decision');
  cy.verifySectionName('Required documents');
});

Given('a file has been uploaded', () => {
  cy.goToUploadThePlansUsedToReachDecisionPage();
  cy.clickChooseFile('upload-file-valid.pdf');
  cy.clickUploadFile().click();
  cy.validateFileUpload('upload-file-valid.pdf');
});

Given('a file has been uploaded and confirmed', () => {
  cy.goToUploadThePlansUsedToReachDecisionPage();
  cy.clickChooseFile('upload-file-valid.pdf');
  cy.clickUploadFile().click();
  cy.validateFileUpload('upload-file-valid.pdf');
  cy.clickSaveAndContinue();
});

Given('The question \'Upload the plans used to reach the decision\' has been completed', () => {
  cy.goToUploadThePlansUsedToReachDecisionPage();
  cy.clickChooseFile('upload-file-valid.pdf');
  cy.clickUploadFile().click();
  cy.validateFileUpload('upload-file-valid.pdf');
  cy.clickSaveAndContinue();
});

When('valid {string} are uploaded', (fileNames) => {
cy.uploadMultipleFiles(fileNames);
cy.clickUploadFile().click();
cy.clickSaveAndContinue();
});

when('files of {string} have been selected', (fileName) => {
  cy.clickChooseFile(fileName);
  cy.clickUploadFile().click();
  cy.validateFileUpload(fileName);
  cy.clickSaveAndContinue();

});

When('the plans used to reach the decision question is requested', () => {
  cy.goToUploadThePlansUsedToReachDecisionPage();
});

Then('the appeal details panel on the right hand side of the page can be viewed', () => {
  cy.verifyAppealDetailsSidebar({});
});

Then('the information they previously entered is still populated', () => {
  cy.validateFileUpload('upload-file-valid.pdf');
});

When('LPA Planning Officer deletes the file', () => {
cy.deleteUploadedFile('upload-file-valid.pdf');
});

Then('the file is removed', () => {
  cy.validateFileDeleted('upload-file-valid.pdf');
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

When('LPA Planning Officer chooses to upload plans used to reach the decision', () => {
  cy.goToUploadThePlansUsedToReachDecisionPage();
  cy.verifyPage(pageUrl);

});

When('no file has been uploaded', () => {
cy.clickSaveAndContinue();
});

Then('progress is halted with error message {string}', (errorMessage) => {
  cy.validateFileUploadErrorMessage(errorMessage);
});

When('Back is then requested', () => {
  cy.clickBackButton();
});
Then('the Task list is presented', () => {
  cy.verifyTaskListPageTitle();
});

Then('LPA Planning Officer is presented with the ability to upload plans', () => {
  cy.verifyPageTitle(pageTitle);
  cy.verifyQuestionTitle('Upload the plans used to reach the decision');
  cy.verifySectionName('Required documents');
});

Then('progress is made to the Task List', () => {
  cy.verifyTaskListPageTitle();
});

Then('Upload the plans used to reach the decision subsection is shown as completed', () => {
  cy.verifyCompletedStatus('plans');
});
