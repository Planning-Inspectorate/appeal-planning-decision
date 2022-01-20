import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
} from '../../../../support/common-page-objects/common-po';
import { getSaveAndContinueButton } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import {
  errorFileUploadField,
  filesCanUploadHintText,
  sectionText, uploadedFileLabel, uploadedFileName,
} from '../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { pageCaption } from '../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';

const url = 'full-appeal/submit-appeal/decision-letter';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const planningAppNumberUrl ='full-appeal/submit-appeal/application-number';
const designAccessStatementUrl = 'full-appeal/submit-appeal/design-access-statement';
const decisionLetterUrl = 'full-appeal/submit-appeal/decision-letter'
const textPageCaption = 'Upload documents from your planning application';
const pageTitle = "Decision letter - Appeal a planning decision - GOV.UK";
const pageHeading = 'Decision letter';
const decisionLetterSectionText = 'This is the letter from the local planning department telling you about the decision on your planning application.';


Given("an appellant is on the 'Design and access statement' page",()=> {
  goToAppealsPage(designAccessStatementUrl);
});
When("they have uploaded a file and select 'continue'",()=> {
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
});
Then("the 'Decision Letter' page is displayed",()=> {
  cy.url().should('contain', decisionLetterUrl);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  //verifySectionName()
  sectionText().should('contain', decisionLetterSectionText);
});
When("they select the 'Continue' button",()=> {
  getSaveAndContinueButton().click();
});
Given( "an appellant is on the 'Decision Letter' page", () => {
  goToAppealsPage(url);
} );
When( "they upload a file {string} and click on Continue button", (filename) => {
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
} );
Then( "'Task list' page is displayed", () => {
  cy.url().should('contain', taskListUrl);
} );
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("'Decision Letter' page is displayed",()=> {
  cy.url().should('contain', url);
})
Then("the uploaded file {string} is displayed", (filename) => {
  uploadedFileLabel().should('exist');
  uploadedFileName().should('contain', filename);
})
Given("an appellant has uploaded a file {string}", (filename) => {
  goToAppealsPage(url);
  getFileUploadButton().attachFile(filename);
})
Then( "an error message {string} is displayed", (errorMessage) => {
  verifyErrorMessage(errorMessage,errorFileUploadField,getErrorMessageSummary);
});
Given("an appellant has not uploaded any document",()=> {
  goToAppealsPage(url);
});
Then("they are presented with the 'Design and access statement' page", () => {
  cy.url().should('contain', designAccessStatementUrl);
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
When( "they drag and drop a file and click on Continue button", () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
