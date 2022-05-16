import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
} from '../../../../../support/common-page-objects/common-po';
import { planningApplicationDocumentsLink } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import {
  errorFileUploadField,
  filesCanUploadHintText,
  sectionText,
  uploadedFileLabel,
  uploadedFileName,
} from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { pageCaption } from '../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';

const url = 'full-appeal/submit-appeal/original-decision-notice';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const applicationFormUrl = 'full-appeal/submit-appeal/application-form';
const textPageCaption = 'Upload documents from your planning application';
const pageTitle =
  'Decision notice from your original planning application - Appeal a planning decision - GOV.UK';
const pageHeading = 'Decision notice from your original planning application';
const pageHeadingText =
  'This is the decision notice that shows the conditions you applied to vary or remove.';

Given("an appellant is on the 'Appeal a Planning Decision page'", () => {
  cy.url().should('contain', taskListUrl);
});

When("they select 'Upload documents from your planning application' link", () => {
  planningApplicationDocumentsLink().click();
});
When("they select the 'Continue' button", () => {
  getSaveAndContinueButton().click();
});
Then("'Planning Application form' page is displayed", () => {
  cy.url().should('contain', url);
});
Then('the uploaded file {string} is displayed', (filename) => {
  uploadedFileLabel().should('exist');
  uploadedFileName().should('contain', filename);
});
Given("an appellant is on the 'Planning Application form' page", () => {
  planningApplicationDocumentsLink().click();
  pageCaption().should('contain', textPageCaption);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  sectionText().should('contain', pageHeadingText);
  filesCanUploadHintText().should('exist');
  filesCanUploadHintText().click();
  cy.checkPageA11y();
});
When('they upload a file {string} and click on Continue button', (filename) => {
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
});

When('they drag and drop a file and click on Continue button', () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
Then("'Planning application form' page is displayed", () => {
  cy.url().should('contain', applicationFormUrl);
});

When("they select 'Save and Continue'", () => {
  getSaveAndContinueButton().click();
});
Then('an error message {string} is displayed on planning application form page', (errorMessage) => {
  verifyErrorMessage(errorMessage, errorFileUploadField, getErrorMessageSummary);
});

Given('an appellant has not uploaded any document', () => {
  planningApplicationDocumentsLink().click();
});

Given("an appellant is on the 'Planning Application' page", () => {
  planningApplicationDocumentsLink().click();
});
When("they click on the 'Back' link", () => {
  getBackLink().click();
});
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain', taskListUrl);
});

Given('an appellant has uploaded a file {string}', (filename) => {
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile(filename);
});
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain', taskListUrl);
});
