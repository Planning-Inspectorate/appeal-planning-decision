import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import {
  appealDocumentsSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  getBackLink, getErrorMessageSummary,
  getFileUploadButton,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { checkboxConfirmSensitiveInfo } from '../../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';
import { selectYes } from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import {
  errorFileUploadField,
  uploadedFileLabelMultipleFiles,
  uploadedFileName,
} from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import {
  backButton,
  summaryErrorMessage,
} from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyFileUploadErrorMessage } from '../../../../../support/common/verifyFileUploadErrorMessage';
import { confirmSupportingDocumentRejectedBecause } from '../../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/confirmSupportingDocumentRejectedBecause';

const Url ='full-appeal/submit-appeal/new-plans-drawings';
const plansDrawingsUrl = 'full-appeal/submit-appeal/plans-drawings';
const appealStatementUrl = 'full-appeal/submit-appeal/appeal-statement';
//const plansDrawingUploadUrl = 'full-appeal/submit-appeal/plans-drawings-upload';
const supportingDocumentsUrl ='full-appeal/submit-appeal/supporting-documents';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const textPageCaption = 'Upload documents for your appeal';
const pageTitle = "New plans and drawings - Appeal a planning decision - GOV.UK";
const pageHeading = 'New plans and drawings';
const filename = 'upload-file-valid.jpeg';
const validFilename1 = 'upload-file-valid.doc';
const validFilename2 = 'upload-file-valid.jpeg';
const validFilename3 = 'appeal-statement-valid.jpeg';
const validFilename4 = 'appeal-statement-valid.tif';

Given('appellant has completed full appeal eligibility journey',()=>{
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});
Given("an Appellant or Agent is on the 'Do you have any new plans for drawings that support your appeal' page", () => {
  appealDocumentsSectionLink().click();
  cy.url().should('include', appealStatementUrl);
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
});
When("they select {string} and click on 'Continue' button", () => {
  selectYes().click();
  getSaveAndContinueButton().click();
});
Then("the 'New plans and drawings' page is displayed", () => {
  cy.url().should('include', Url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText().should('contain', textPageCaption);
  cy.checkPageA11y();
});
When("they click on 'Continue' button", () => {
  getSaveAndContinueButton().click();
});
Given("an Appellant or Agent is on the 'New plans and drawings' page", () => {
  appealDocumentsSectionLink().click();
  cy.url().should('include', appealStatementUrl);
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', Url);
});
When("they add a valid file through 'Choose files' or 'drag and drop'", () => {
  getFileUploadButton().attachFile([validFilename1, validFilename2]);
});
Then("they are presented with the page 'Do you want to submit any new supporting documents with your appeal?'", () => {
  cy.url().should('include', supportingDocumentsUrl);
});
When("they select the 'Back' link",()=> {
  getBackLink().click();
});
And("they can see the files already uploaded", () => {
  cy.url().should('include', Url);
  uploadedFileLabelMultipleFiles().should('exist');
  uploadedFileName().should('contain', validFilename1);
  uploadedFileName().should('contain', validFilename2);
});
And("they can replace the files by selecting 'Choose files'", () => {
  getFileUploadButton().attachFile([validFilename3,validFilename4], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
  cy.url().should('include',supportingDocumentsUrl);
});
Given("they have uploaded a file {string}", (fileName) => {
  if (fileName === "") {
    getSaveAndContinueButton().click();
  }
  else {
    getFileUploadButton().attachFile(fileName, { subjectType: 'drag-n-drop' });
  }
});
When("they upload one {string} and one {string} through 'drag and drop' and click 'Continue'", (validFile, invalidFile) => {
  getFileUploadButton().attachFile ([validFile,invalidFile], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
Then("{string} or {string} {string} is displayed", (invalidFile1, invalidFile2, errormessage) => {
  const invalidFileErrorMessage1 = invalidFile1 + ' ' + errormessage;
  const  invalidFileErrorMessage2 = invalidFile2 + ' ' + errormessage;
  let invalidFileErrorMessage = invalidFileErrorMessage1 + ':' + invalidFileErrorMessage2;
  verifyErrorMessage(invalidFileErrorMessage2, errorFileUploadField, getErrorMessageSummary);
  //verifyFileUploadErrorMessage(invalidFileErrorMessage,errorFileUploadField,'file-upload', invalidFile1, invalidFile2);
});
Then("they will have to upload any valid files again", () => {
  cy.reload();
  getFileUploadButton().attachFile ([validFilename2, validFilename2], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
  cy.url().should('contain', supportingDocumentsUrl);
});
Given("is uploading two files {string} and {string}", (invalidFile1, invalidFile2) => {
  getFileUploadButton().attachFile ([invalidFile1,invalidFile2]);
});
When("InvalidFile1 is replaced with {string} and uploaded along with the {string}", (validFile, invalidFile2) => {
  cy.reload();
  getFileUploadButton().attachFile ([validFile,invalidFile2], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
Then("{string} {string} is displayed", (invalidFile2, errormessage) => {
  const invalidFileErrorMessage2 = invalidFile2 + ' ' + errormessage;
  verifyErrorMessage(invalidFileErrorMessage2,errorFileUploadField, getErrorMessageSummary);
})
When("they click on the 'Back' link", () => {
  backButton().click();
});
Then("they are presented with the 'Plans and drawings' page", () => {
  cy.url().should('contain',plansDrawingsUrl);
});
Then("the file {string} {string} is displayed", (filename, errormessage) => {
  const fileName = filename + ' ' + errormessage;
  verifyErrorMessage(fileName,errorFileUploadField, getErrorMessageSummary);
});
