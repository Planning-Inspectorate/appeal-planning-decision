import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getErrorMessageSummary,
  getFileUploadButton,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import {
  dragAndDropMultipleFiles, errorFileUploadField, uploadedFileLabelMultipleFiles, uploadedFileName,
} from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import {
  appealDocumentsSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { checkNoSensitiveInformation } from '../../../../../support/householder-planning/appeals-service/appeal-statement-submission/checkNoSensitiveInformation';
import { selectNo, selectYes } from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { backButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

const Url = 'full-appeal/submit-appeal/new-supporting-documents';
const appealStatementUrl = 'full-appeal/submit-appeal/appeal-statement';
const plansDrawingUrl = 'full-appeal/submit-appeal/plans-drawings';
const supportingDocumentsUrl ='full-appeal/submit-appeal/supporting-documents';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const textPageCaption = 'Upload documents for your appeal';
const pageTitle = "New supporting documents - Appeal a planning decision - GOV.UK";
const pageHeading = 'New supporting documents';
const validFilename1 = 'upload-file-valid.doc';
const validFilename2 = 'upload-file-valid.jpeg';
const validFilename3 = 'appeal-statement-valid.jpeg';
const validFilename4 = 'appeal-statement-valid.tif';
const invalidFilename1 = 'upload-file-invalid-wrong-type.csv';

const newSupportingDocsMethods = () => {
  appealDocumentsSectionLink().click();
  cy.url().should('contain',appealStatementUrl);
  getFileUploadButton().attachFile(validFilename1);
  checkNoSensitiveInformation();
  getSaveAndContinueButton().click();
  cy.url().should('contain',plansDrawingUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',supportingDocumentsUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', Url);
};


Given("an Appellant or Agent is on the 'Do you want to submit any new supporting documents with your appeal?' page", () => {
  appealDocumentsSectionLink().click();
  cy.url().should('contain',appealStatementUrl);
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  checkNoSensitiveInformation();
  getSaveAndContinueButton().click();
  cy.url().should('contain',plansDrawingUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',supportingDocumentsUrl);
  });
When("they select 'Yes' and click 'Continue' button", () => {
  selectYes().click();
  getSaveAndContinueButton().click();
});
Then("the 'New supporting documents' page is displayed and the sub heading 'Drag and drop or choose files'", () => {
  cy.url().should('contain', Url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText().should('contain', textPageCaption);
  dragAndDropMultipleFiles().should('exist');
  cy.checkPageA11y();
});
Given("an Appellant or Agent is on the 'New supporting documents' page", () => {
  newSupportingDocsMethods();
});
When("they upload a valid file through 'Choose files' or 'drag and drop' and click 'Continue'", () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
When("they select the 'Continue' button", () => {
  getSaveAndContinueButton().click();
});
Then("they are returned to the task list", () => {
  cy.url().should('contain', taskListUrl);
});

Given("an Appellant or Agent has uploaded a file {string} in the 'New supporting documents' page", (filename) => {
  newSupportingDocsMethods();
  if (filename === "") {
    getSaveAndContinueButton().click();
     }
  else {
    getFileUploadButton().attachFile(filename, { subjectType: 'drag-n-drop' });
  }
});
Then("an error message {string} is displayed", (errorMessage) => {
  verifyErrorMessage(errorMessage,errorFileUploadField,getErrorMessageSummary);
});
When("they upload one {string} and one {string} through 'Choose files' or 'drag and drop' and click 'Continue'", (validFile, invalidFile) => {
  getFileUploadButton().attachFile ([validFile,invalidFile], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
})
Then("an {string} is displayed for the {string}", (errormessage, invalidFile) => {
  const invalidFileErrorMessage  = invalidFile + ' ' + errormessage;
  verifyErrorMessage(invalidFileErrorMessage,errorFileUploadField,getErrorMessageSummary);
});
Then("they will have to upload any valid files again", () => {
  cy.reload();
  getFileUploadButton().attachFile ([validFilename1, validFilename2], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
});
When("they click on the 'Back' link", () => {
  backButton().click();
});
Then("they are presented with the 'Do you want to submit any new supporting documents with your appeal?' page", () => {
  cy.url().should('contain', supportingDocumentsUrl);
});

Given("they can see the previously uploaded files and the text 'Replace the files' should be displayed", () => {
  getFileUploadButton().attachFile ([validFilename1, validFilename2], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  cy.go('back');
  cy.url().should('contain', Url);
  uploadedFileLabelMultipleFiles().should('exist');
  uploadedFileName().should('contain', validFilename1);
  uploadedFileName().should('contain', validFilename2);
  cy.downloadFile(`${Cypress.env('APPEALS_BASE_URL')}/${Url}`,'cypress/downloads', validFilename2);
  cy.readFile("cypress/downloads/upload-file-valid.jpeg");
});
When("they upload multiple files and click 'Continue'", () => {
  getFileUploadButton().attachFile ([validFilename3, validFilename4], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
});
When("they click on browser back button", () => {
  cy.go('back');
});
Then("the old files are replaced with the new files", () => {
  uploadedFileLabelMultipleFiles().should('exist');
  uploadedFileName().should('contain', validFilename3);
  uploadedFileName().should('contain', validFilename4);
})

