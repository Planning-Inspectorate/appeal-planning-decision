import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { linkDecideYourAppeal } from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { pageCaptionText } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  decideYourAppealPageCaption, decideYourAppealPageHeading,
  procedureErrorMessage,
  selectHearing, selectInquiry,
  selectWrittenRepresentations,
} from '../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import {
  getBackLink, getErrorMessageSummary,
  getPageHeading,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';


const taskListUrl = 'full-appeal/submit-appeal/task-list';
const Url = 'full-appeal/submit-appeal/how-decide-appeal';
const hearingUrl = 'full-appeal/submit-appeal/why-hearing';
const inquiryUrl = 'full-appeal/submit-appeal/why-inquiry';
const pageTitle = 'How would you prefer us to decide your appeal? - Appeal a planning decision - GOV.UK';
const pageHeading = 'How would you prefer us to decide your appeal?';
const textPageCaption = 'Tell us how you would prefer us to decide your appeal';

Given('appellant has completed full appeal eligibility journey',()=>{
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given("an Appellant or Agent is on the 'Appeal a Planning Decision' page", () => {
  cy.url().should('include', taskListUrl);
});
When("the user click the link 'Tell us how you would prefer us to decide your appeal'", () => {
  linkDecideYourAppeal().click();
});
Then("'How would you prefer us to decide your appeal?' page is displayed", () => {
  cy.url().should('include', Url);
});
Given("an Appellant or Agent is on the 'How would you prefer us to decide your appeal' page", () => {
  linkDecideYourAppeal().click();
  cy.url().should('include', Url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText().should('contain', textPageCaption);
  cy.checkPageA11y();
});
When("the user selects {string} and clicks on 'Continue' button", (option) => {
  switch (option){
    case 'Written representations':
      selectWrittenRepresentations().click();
      getSaveAndContinueButton().click();
      break;
    case 'Hearing':
      selectHearing().click();
      getSaveAndContinueButton().click();
      break;
    case 'Inquiry':
      selectInquiry().click();
      getSaveAndContinueButton().click();
      break;
    case 'None of the options':
      getSaveAndContinueButton().click();
  }
});
Then("the user is taken back to the 'Appeal a Planning Decision' task list page", () => {
  cy.url().should('include', taskListUrl);
});
Then("the user is taken to the next page {string}", (page) => {
  switch (page){
    case 'Why would you prefer a hearing?':
      cy.url().should('include', hearingUrl);
      break;
    case 'Why would you prefer an inquiry?':
      cy.url().should('include', inquiryUrl);
      break;
  }
});
Then('the user is presented with an error message {string}', (errormessage) => {
  verifyErrorMessage(errormessage, procedureErrorMessage, getErrorMessageSummary);
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
When("they click on the 'browser back' button", () => {
  cy.go('back');
})
Then('the option {string} should be selected', (option) => {
  switch (option) {
    case 'Written representations':
      selectWrittenRepresentations().should( 'be.checked' );
      break;
    case 'Hearing':
      selectHearing().should( 'be.checked' );
      break;
    case 'Inquiry':
      selectInquiry().should( 'be.checked' );
      break;
  }
});
