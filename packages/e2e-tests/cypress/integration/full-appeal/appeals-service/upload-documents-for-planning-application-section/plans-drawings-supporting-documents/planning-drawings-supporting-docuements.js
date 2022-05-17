import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { planningApplicationDocumentsLink } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
} from '../../../../../support/common-page-objects/common-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { planningApplicationNumber } from '../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { pageCaptionText } from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import {
  errorFileUploadField,
  sectionText,
  uploadedFileLabelMultipleFiles,
  uploadedFileName,
} from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { selectApplicationCertificatesSeparate } from '../../../../../support/full-appeal/appeals-service/selectApplicationCertificatesSeparate';

const pageHeading = 'Plans, drawings and supporting documents';
const url = '/full-appeal/submit-appeal/plans-drawings-documents';
const planningAppFormUrl = 'full-appeal/submit-appeal/application-form';
const planningApplicationNumberUrl = 'full-appeal/submit-appeal/application-number';
const designAccessStatementSubmittedUrl =
  'full-appeal/submit-appeal/design-access-statement-submitted';
const pageTitle = 'Plans, drawings and supporting documents - Appeal a planning decision - GOV.UK';
const pageCaption = 'Upload documents from your planning application';
const planningAppNumberText = 'PNO-TEST123';
const pageSectionText =
  'Upload the plans, drawings and supporting documents you submitted with your application.';
const validFilename1 = 'upload-file-valid.doc';
const validFilename2 = 'upload-file-valid.jpeg';
const validFilename3 = 'appeal-statement-valid.jpeg';
const validFilename4 = 'appeal-statement-valid.tif';

Given('an appellant is on the What is your planning application number? page', () => {
  planningApplicationDocumentsLink().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
  selectApplicationCertificatesSeparate('No');
  cy.url().should('contain', planningApplicationNumberUrl);
});

Given('an appellant is navigated to the Plans, drawings and supporting documents page', () => {
  planningApplicationDocumentsLink().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
  selectApplicationCertificatesSeparate('No');
  cy.url().should('contain', planningApplicationNumberUrl);
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
});

Given('an appellant has uploaded an invalid file {string}', (filename) => {
  getFileUploadButton().attachFile(filename);
});

When('appellant enters the planning application number and click continue', () => {
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
});

When(
  'they upload one {string} and one {string} through drag and drop and click continue',
  (validFile, invalidFile) => {
    getFileUploadButton().attachFile([validFile, invalidFile], { subjectType: 'drag-n-drop' });
    getSaveAndContinueButton().click();
  },
);
When('they drag and drop a file and click on Continue button', () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});

When('appellant uploads a valid files and click continue', () => {
  getFileUploadButton().attachFile([validFilename1, validFilename2]);
  getSaveAndContinueButton().click();
});

When('appellant uploads a valid file {string} and click continue', (filename) => {
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
});

When('appellant selects the continue button', () => {
  getSaveAndContinueButton().click();
});

Then('appellant is presented with Plans, drawings and supporting documents page', () => {
  cy.url().should('contain', url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText(pageCaption);
  sectionText(pageSectionText);
});

Then(
  'appellant is presented with Did you submit a design and access statement with your application page',
  () => {
    cy.url().should('contain', designAccessStatementSubmittedUrl);
  },
);

Then('an error message {string} is displayed', (errorMessage) => {
  verifyErrorMessage(errorMessage, errorFileUploadField, getErrorMessageSummary);
});

When('appellant selects the back link', () => {
  getBackLink().click();
});

Then('appellant can see the files already uploaded', () => {
  uploadedFileLabelMultipleFiles().should('exist');
  uploadedFileName().should('contain', validFilename1);
  uploadedFileName().should('contain', validFilename2);
});

Then('appellant can replace the files by selecting choose files', () => {
  getFileUploadButton().attachFile([validFilename3, validFilename4], {
    subjectType: 'drag-n-drop',
  });
  getSaveAndContinueButton().click();
  cy.url().should('include', designAccessStatementSubmittedUrl);
});
Then('appellant uploads {string} again', (fileName) => {
  cy.reload();
  getFileUploadButton().attachFile(fileName, { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});

Then('appellant is presented with the What is your planning application number page', () => {
  cy.url().should('contain', planningApplicationNumberUrl);
  planningApplicationNumber().should('have.value', planningAppNumberText);
});
