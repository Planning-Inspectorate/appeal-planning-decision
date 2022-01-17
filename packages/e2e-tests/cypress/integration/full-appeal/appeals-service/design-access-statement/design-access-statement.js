import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { appealDocumentsSectionLink } from '../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';
import { getErrorMessageSummary, getFileUploadButton } from '../../../../support/common-page-objects/common-po';
import { getSaveAndContinueButton } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { pageCaption } from '../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { errorFileUploadField } from '../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';

const url = 'full-appeal/submit-appeal/design-access-statement';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const decisionLetterUrl = '/full-appeal/submit-appeal/decision-letter';
const textPageCaption = 'Upload documents from your planning application';
const pageTitle = "Design and access statement - Appeal a planning decision - GOV.UK";
const pageHeading = 'Design and access statement';

Given("an appellant is on the 'Did you submit a design and access statement with your application' page",()=> {
  goToAppealsPage(taskListUrl);
})
When("they select the 'Yes' option",()=> {
  appealDocumentsSectionLink().click();
})
Then("the 'Design and access statement' page is displayed", () => {
  cy.url().should('contain',url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaption().should('contain', textPageCaption);
});
Then("they are presented with the 'Decision letter' page", () => {
  cy.url().should('contain', decisionLetterUrl);
})
Given("an appellant is on the 'Design and access statement' page",()=> {
  goToAppealsPage(url);
})
When("they upload a valid file {string}",(filename)=> {
  getFileUploadButton().attachFile(filename);
})
When("they select the 'Continue' button",()=> {
  getSaveAndContinueButton().click();
})
Given("an appellant has uploaded an invalid file {string}",(filename)=> {
  goToAppealsPage(url);
  getFileUploadButton().attachFile(filename);
})
Then('an error message {string} is displayed',(errorMessage)=> {
  verifyErrorMessage(errorMessage,errorFileUploadField,getErrorMessageSummary);
});
Given("an appellant has not uploaded any document",()=> {
  goToAppealsPage(url);
});
When( "they drag and drop a file and click on Continue button", () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
