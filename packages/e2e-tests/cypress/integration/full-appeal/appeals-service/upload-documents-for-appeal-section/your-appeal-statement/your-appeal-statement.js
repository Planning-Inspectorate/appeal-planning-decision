import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import {
    appealStatementBodyText, checkboxConfirmSensitiveInfo, checkboxErrorMessage, sensitiveInfoLabel,
} from '../../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import {
  pageCaption} from '../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import {
  dragAndDropAFile, errorFileUploadField, filesCanUploadHintText,
  filesYouCanUpload, uploadedFileLabel, uploadedFileName,
} from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
} from '../../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { appealDocumentsSectionLink } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { acceptCookiesBanner } from '../../../../../support/common/accept-cookies-banner';

const url = 'full-appeal/submit-appeal/appeal-statement';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const planDrawingUrl = '/full-appeal/plans-drawings';
const textPageCaption = 'Upload documents for your appeal';
const pageTitle = "Your appeal statement - Appeal a planning decision - GOV.UK";
const pageHeading = 'Your appeal statement';
const appealStatementText = "Your appeal statement explains why you think the local planning department's decision was incorrect.";


Given("an appellant is on the 'Appeal a Planning Decision' task list page",()=> {
  goToAppealsPage(taskListUrl);
  acceptCookiesBanner();
  })
When("they click the link 'Upload documents for your appeal'",()=> {
  appealDocumentsSectionLink().click();
})
Then("the 'Your appeal statement page is displayed'",()=> {
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaption().should('contain', textPageCaption);
  appealStatementBodyText().should('contain', appealStatementText);
  sensitiveInfoLabel().click();
  dragAndDropAFile().should('exist');
  filesYouCanUpload().click();
  filesCanUploadHintText().should('exist');
  checkboxConfirmSensitiveInfo().should('exist');
  })

Given("an appellant is on the 'Your appeal statement' page",()=> {
  goToAppealsPage(url);
  acceptCookiesBanner();
})
When("they upload a valid file {string}",(filename)=> {
  getFileUploadButton().attachFile(filename);
})
When("select the checkbox 'I confirm that I have not included any sensitive information in my appeal statement'",()=> {
 checkboxConfirmSensitiveInfo().click();
})
When("they select the 'Continue' button",()=> {
  getSaveAndContinueButton().click();
})
Then("they are presented with the 'Plans and drawings' page",()=> {
  cy.url().should('contain',planDrawingUrl);
})
Given("an appellant has uploaded an invalid file {string}",(filename)=> {
  goToAppealsPage(url);
  acceptCookiesBanner();
  getFileUploadButton().attachFile(filename);
})
Then('an error message {string} is displayed',(errorMessage)=> {
  verifyErrorMessage(errorMessage,errorFileUploadField,getErrorMessageSummary);
});
Then("an error message {string} for checkbox is displayed", (errorMessage) => {
  verifyErrorMessage(errorMessage,checkboxErrorMessage,getErrorMessageSummary);
});
Given("an appellant has not uploaded any document",()=> {
  goToAppealsPage(url);
  acceptCookiesBanner();
});
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain',taskListUrl)
});

Given("an appellant has not ticked the box to confirm they have not included any sensitive information", () => {
  goToAppealsPage(url);
  acceptCookiesBanner();
  getFileUploadButton().attachFile( 'upload-file-valid.doc' );
});
Given("an appellant has not uploaded any document or ticked the box to confirm they have not included any sensitive information", () => {
  goToAppealsPage(url);
  acceptCookiesBanner();
getSaveAndContinueButton().click();
});
Given( "an appellant is on the 'Your appeal statement' page", () => {
  goToAppealsPage(url);
  acceptCookiesBanner();
} );
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Appeal a planning decision' task list page",()=> {
  cy.url().should('contain', taskListUrl);
});

Given("an appellant is on the 'Your appeal statement' page and have uploaded a valid file {string}", (filename) => {
  goToAppealsPage(url);
  acceptCookiesBanner();
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
});
Then("the uploaded file {string} is displayed and can be downloaded", (filename) => {
  uploadedFileLabel().should('exist');
  uploadedFileName().should('contain', filename);
  cy.downloadFile(`${Cypress.env('APPEALS_BASE_URL')}/${url}`,'cypress/fixtures/Download', filename);
  console.log(url);
})





