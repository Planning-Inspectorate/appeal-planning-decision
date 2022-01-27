import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import {

  getBackLink, getErrorMessageSummary, getFileUploadButton,
  getSaveAndContinueButton,
} from '../../../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../../../support/common/verify-error-message';
import {
  designAccessStateSubmittedError, submitADesignStNo,
  submitADesignStYes, pageCaption
} from '../../../../../../support/full-appeal/appeals-service/page-objects/design-access-statement-submitted-po';
import { goToAppealsPage } from '../../../../../../support/common/go-to-page/goToAppealsPage';
import { planningApplicationDocumentsLink } from '../../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { planningApplicationNumber } from '../../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { verifyPageTitle } from '../../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../../support/common/verify-page-heading';
import { acceptCookiesBanner } from '../../../../../../support/common/accept-cookies-banner';


const url = 'full-appeal/submit-appeal/design-access-statement-submitted';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const planningApplicationNoUrl = 'full-appeal/submit-appeal/application-number';
const designAccessStatementUrl = 'full-appeal/submit-appeal/design-access-statement';
const decisionLetterUrl = 'full-appeal/submit-appeal/decision-letter';
const textPageCaption = 'Upload documents from your planning application';
const pageTitle = "Did you submit a design and access statement with your application? - Appeal a planning decision - GOV.UK";
const pageHeading = 'Did you submit a design and access statement with your application?';
const filename = 'appeal-statement-valid.jpeg';
const textPlanningAppNumber = 'PNO-1122';

Given("an appellant or agent is on the 'What is your planning application number' page", () => {
  goToAppealsPage(planningApplicationNoUrl);
  acceptCookiesBanner();
  planningApplicationNumber().type(`{selectall}{backspace}${textPlanningAppNumber}`)
  });
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
When("they select the 'Continue' button",()=> {
  getSaveAndContinueButton().click();
});
Then('an error message {string} is displayed', (errorMessage) => {
  verifyErrorMessage(errorMessage,designAccessStateSubmittedError, getErrorMessageSummary);
});
Given("an appellant or agent is on the 'Did you submit a design and access statement with your application?' page", () => {
  goToAppealsPage(taskListUrl);
  acceptCookiesBanner();
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
  cy.url().should('contain', planningApplicationNoUrl);
  planningApplicationNumber().type(textPlanningAppNumber);
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaption().should('contain', textPageCaption);
});
Then("they are presented with the 'Design and access statement' page", () => {
  cy.url().should('contain', designAccessStatementUrl);
});
Then("they are presented with the 'What is your planning application number' page", () => {
  cy.url().should('contain', planningApplicationNoUrl);
});
Then("they are presented with the 'Decision Letter' page", () => {
  cy.url().should('contain', decisionLetterUrl);
});
When("the user select 'Yes' and click continue", () => {
  submitADesignStYes().click();
  getSaveAndContinueButton().click();
});
When("they select 'No' and click continue", () => {
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
});
Then("they are presented with the 'Did you submit a design and access statement with your application?' page", () => {
  cy.url().should('contain', url);
});
