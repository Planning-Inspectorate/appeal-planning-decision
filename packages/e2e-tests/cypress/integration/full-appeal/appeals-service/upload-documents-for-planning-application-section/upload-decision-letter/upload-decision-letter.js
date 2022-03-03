import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
} from '../../../../../support/common-page-objects/common-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import {
  errorFileUploadField,
  sectionText, uploadedFileLabel, uploadedFileName,
} from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { planningApplicationNumber} from '../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { submitADesignStNo } from '../../../../../support/full-appeal/appeals-service/page-objects/design-access-statement-submitted-po';
import {
  pageCaptionText,
  planningApplicationDocumentsLink,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';

const url = 'full-appeal/submit-appeal/decision-letter';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const planningAppFormUrl ='full-appeal/submit-appeal/application-form';
const planningAppNumberUrl = 'full-appeal/submit-appeal/application-number';
const designAccessStatementSubmittedUrl = 'full-appeal/submit-appeal/design-access-statement-submitted';
const plansAndDrawingsDocumentsUrl = 'full-appeal/submit-appeal/plans-drawings-documents';
const decisionLetterUrl = 'full-appeal/submit-appeal/decision-letter'
const textPageCaption = 'Upload documents from your planning application';
const pageTitle = "Decision letter - Appeal a planning decision - GOV.UK";
const pageHeading = 'Decision letter';
const decisionLetterSectionText = 'This is the letter from the local planning department telling you about the decision on your planning application.';
const planningAppNumberText = 'PNO-TEST123';


Given("an appellant is on the 'Design and access statement submitted' page",()=> {
  planningApplicationDocumentsLink().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile('upload-file-valid.pdf');
  getSaveAndContinueButton().click();
  cy.url().should('contain',designAccessStatementSubmittedUrl )
});
When("they have uploaded a file and select 'continue'",()=> {
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
});
When("they select 'No' and click continue", () => {
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
});
Then("the 'Decision Letter' page is displayed",()=> {
  cy.url().should('contain', decisionLetterUrl);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText().should('contain', textPageCaption);
  sectionText().should('contain', decisionLetterSectionText);
});
When("they select the 'Continue' button",()=> {
  getSaveAndContinueButton().click();
});
Given( "an appellant is on the 'Decision Letter' page", () => {
  planningApplicationDocumentsLink().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile('upload-file-valid.pdf');
  getSaveAndContinueButton().click();
  cy.url().should('contain',designAccessStatementSubmittedUrl);
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',decisionLetterUrl);
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
  planningApplicationDocumentsLink().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile('upload-file-valid.pdf');
  getSaveAndContinueButton().click();
  cy.url().should('contain',designAccessStatementSubmittedUrl);
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',decisionLetterUrl);
  getFileUploadButton().attachFile(filename);
})
Then( "an error message {string} is displayed", (errorMessage) => {
  verifyErrorMessage(errorMessage,errorFileUploadField,getErrorMessageSummary);
});
Given("an appellant has not uploaded any document",()=> {
  planningApplicationDocumentsLink().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile('upload-file-valid.jpeg');
  getSaveAndContinueButton().click();
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile('upload-file-valid.pdf');
  getSaveAndContinueButton().click();
  cy.url().should('contain',designAccessStatementSubmittedUrl);
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',decisionLetterUrl);
  cy.checkPageA11y();
});
Then("they are presented with the 'Design and access statement submitted' page", () => {
  cy.url().should('contain', designAccessStatementSubmittedUrl);
});
Then("they are presented with the 'What is your planning application number?' page", () => {
  cy.url().should('contain', planningAppNumberUrl);
});
When("they click on the Back link",()=> {
  getBackLink().click();
});
When( "they drag and drop a file and click on Continue button", () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain', taskListUrl);
})
Then("they are presented with the 'Planning application form' page", () => {
  cy.url().should('contain', planningAppFormUrl);
});

Then('the user are presented with plans and drawings documents page', () => {
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
});
