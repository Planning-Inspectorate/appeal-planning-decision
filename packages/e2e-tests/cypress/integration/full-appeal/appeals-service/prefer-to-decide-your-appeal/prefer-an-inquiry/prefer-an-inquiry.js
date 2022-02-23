import { Given } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { linkDecideYourAppeal } from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import {
  inquiryTextBoxErrorMessage,
  selectInquiry,
  textBoxInquiry,
} from '../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { pageCaptionText } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';


const taskListUrl = 'full-appeal/submit-appeal/task-list';
const Url = 'full-appeal/submit-appeal/why-inquiry';
const decideAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const daysToExpectTheInquiry = 'full-appeal/submit-appeal/expect-inquiry-last';
const pageTitle = 'Why would you prefer an inquiry? - Appeal a planning decision - GOV.UK';
const pageHeading = 'Why would you prefer an inquiry?';
const textPageCaption = 'Tell us how you would prefer us to decide your appeal';
const textInquiry = 'I want to take part in the inquiry process - 123456789';
Given('appellant has completed full appeal eligibility journey',()=>{
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given("an Appellant or Agent is on the 'How would you prefer us to decide your appeal'", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
});
When("they select the option 'Inquiry'", () => {
  selectInquiry().click();
  getSaveAndContinueButton().click();
});
Then("'Why would you prefer an inquiry?' page is displayed", () => {
  cy.url().should('include', Url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText().should('contain', textPageCaption);
  cy.checkPageA11y();
});
Given("an Appellant or Agent is on the 'Why would your prefer a inquiry?' page", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectInquiry().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', Url);
});
When("they enter text into the box and click 'Continue'", () => {
  textBoxInquiry().clear().type(textInquiry);
  getSaveAndContinueButton().click();
});
Then("the 'How many days would you expect the inquiry to last? page is displayed", () => {
  cy.url().should('include',daysToExpectTheInquiry);
});
Given("an Appellant or Agent has not provided any details", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectInquiry().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', Url);
  });
When("they click 'Continue'", () => {
  getSaveAndContinueButton().click();
});
Then("they are presented with an error message {string}", (errormessage) => {
  verifyErrorMessage(errormessage,inquiryTextBoxErrorMessage, getErrorMessageSummary);
});
Given("an appellant agent has entered more than 255 characters into the text box", () =>{
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectInquiry().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', Url);
  const count = 255;
  const value = 'x'.repeat(count + 1);
  textBoxInquiry().clear().type(value);
});
When("they click on the 'Back' link", () => {
  getBackLink().click();
});
Then("they are presented with the 'How would you prefer us to decide your appeal' page", () => {
  cy.url().should('include', decideAppealUrl)
});
Then("the 'Inquiry' option is selected", () => {
  selectInquiry().should('be.checked');
})

