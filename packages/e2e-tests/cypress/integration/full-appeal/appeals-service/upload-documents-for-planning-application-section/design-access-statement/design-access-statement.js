import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
} from '../../../../../support/common-page-objects/common-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import {
  pageCaption,
  planningApplicationNumber,
} from '../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { errorFileUploadField } from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { planningApplicationDocumentsLink } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { submitADesignStYes } from '../../../../../support/full-appeal/appeals-service/page-objects/design-access-statement-submitted-po';
import { selectYes } from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';

const url = 'full-appeal/submit-appeal/design-access-statement';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const decisionLetterUrl = '/full-appeal/submit-appeal/decision-letter';
const planningApplicationNoUrl = 'full-appeal/submit-appeal/application-number';
const designAccessStatementSubmittedUrl = 'full-appeal/submit-appeal/design-access-statement-submitted';
const plansAndDrawingsDocumentsUrl = 'full-appeal/submit-appeal/plans-drawings-documents';
const planningAppNumberUrl = 'full-appeal/submit-appeal/application-number';
const planningAppFormUrl = 'full-appeal/submit-appeal/application-form';
const textPageCaption = 'Upload documents from your planning application';
const pageTitle = "Design and access statement - Appeal a planning decision - GOV.UK";
const pageHeading = 'Design and access statement';
const filename = 'appeal-statement-valid.jpeg';
const textPlanningAppNumber = 'PNO-1122';

Given("an appellant is on the 'Did you submit a design and access statement with your application' page",()=> {
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  cy.url().should('contain', planningApplicationNoUrl);
  planningApplicationNumber().type(textPlanningAppNumber);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  cy.url().should('contain', designAccessStatementSubmittedUrl);
 })
When("they select the 'Yes' option",()=> {
  submitADesignStYes().click();
  getSaveAndContinueButton().click();
})
Then("the 'Design and access statement' page is displayed", () => {
  cy.url().should('contain',url);
  cy.checkPageA11y();
});
Then("they are presented with the 'Decision letter' page", () => {
  cy.url().should('contain', decisionLetterUrl);
})
Given("an appellant is on the 'Design and access statement' page",()=> {
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  planningApplicationNumber().type(textPlanningAppNumber);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaption().should('contain', textPageCaption);
})
When("they upload a valid file {string}",(filename)=> {
  getFileUploadButton().attachFile(filename);
})
When("they select the 'Continue' button",()=> {
  getSaveAndContinueButton().click();
})
Given("an appellant has uploaded an invalid file {string}",(filename)=> {
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile(filename);
})
Then('an error message {string} is displayed',(errorMessage)=> {
  verifyErrorMessage(errorMessage,errorFileUploadField,getErrorMessageSummary);
});
Given("an appellant has not uploaded any document",()=> {
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  planningApplicationNumber().type(textPlanningAppNumber);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  cy.url().should('contain', designAccessStatementSubmittedUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  });
When( "they drag and drop a file and click on Continue button", () => {
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg', { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
Then("they are presented with the 'Did you submit a design and access statement with your application?' page", () => {
  cy.url().should('contain', designAccessStatementSubmittedUrl);
});
When("they click on the Back link",()=> {
  getBackLink().click();
});
Then("they are presented with the What is your planning application number? page", () => {
  cy.url().should('contain', planningAppNumberUrl);
});
Then("the user is presented with the 'Planning application form' page", () => {
  cy.url().should('contain', planningAppFormUrl);
})
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain', taskListUrl);
})
Then("the user is presented with the 'Did you submit a design and access statement with your application?' page", () => {
  cy.url().should('contain', designAccessStatementSubmittedUrl);
});

Given("an appellant is on the 'Design and access statement' page from the task list page", () => {
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  cy.url().should('contain', planningApplicationNoUrl);
  planningApplicationNumber().type(textPlanningAppNumber);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  cy.url().should('contain', designAccessStatementSubmittedUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
});

Then('the user are presented with plans and drawings documents page',()=>{
  cy.url().should('contain',plansAndDrawingsDocumentsUrl);
})
