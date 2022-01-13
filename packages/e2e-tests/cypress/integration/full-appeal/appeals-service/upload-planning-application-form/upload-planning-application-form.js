import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
} from '../../../../support/common-page-objects/common-po';
import { planningApplicationDocuments } from '../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { getSaveAndContinueButton } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import {
  errorFileUploadField, filesCanUploadHintText,
  sectionText, uploadedFileLabel, uploadedFileName,
} from '../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { pageCaption } from '../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';

const url = 'full-appeal/submit-appeal/application-form';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const planningAppNumberUrl ='full-appeal/submit-appeal/application-number';
const textPageCaption = 'Upload documents from your planning application';
const pageTitle = "Planning application form - Appeal a planning decision - GOV.UK";
const pageHeading = 'Planning application form';
const pageHeadingText = "If you do not have your planning application form, you can find it by searching for your planning application on your local planning department's website.";


Given("an appellant is on the 'Appeal a Planning Decision page'",()=> {
  goToAppealsPage(taskListUrl);
 })
When("they select 'Upload documents from your planning application'",()=> {
  planningApplicationDocuments().click();
})
Then("'Planning Application form' page is displayed",()=> {
  cy.url().should('contain', url);
})
Then("the uploaded file {string} is displayed", (filename) => {
  uploadedFileLabel().should('exist');
  uploadedFileName().should('contain', filename);
})
Given( "an appellant is on the 'Planning Application form' page", () => {
  goToAppealsPage(url);
  pageCaption().should('contain', textPageCaption);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  sectionText().should('contain', pageHeadingText);
  filesCanUploadHintText().should('exist');
  filesCanUploadHintText().click();
 } );
When( "they upload a file {string} and click on Continue button", (filename) => {
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
} );

When( "they drag and drop a file and click on Continue button", () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
Then( "'What is your planning application number' page is displayed", () => {
  cy.url().should('contain', planningAppNumberUrl);
} );

When( "they select 'Save and Continue'", () => {
  getSaveAndContinueButton().click();
} );
Then( "an error message {string} is displayed", (errorMessage) => {
  verifyErrorMessage(errorMessage,errorFileUploadField,getErrorMessageSummary);
});

Given("an appellant has not uploaded any document",()=> {
  goToAppealsPage(url);
});

Given("an appellant is on the 'Planning Application' page",()=> {
  goToAppealsPage(taskListUrl);
  planningApplicationDocuments().click();
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain',taskListUrl)
});

Given("an appellant has uploaded a file {string}", (filename) => {
  goToAppealsPage(url);
  getFileUploadButton().attachFile(filename);
})



