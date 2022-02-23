import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { Given } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { linkDecideYourAppeal } from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import {
  expectedDaysErrorMessage,
  selectInquiry, textBoxExpectDays,
  textBoxInquiry,
} from '../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { pageCaptionText } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';

const taskListUrl = 'full-appeal/submit-appeal/task-list';
const whyInquiryUrl = 'full-appeal/submit-appeal/why-inquiry';
const decideAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const Url = 'full-appeal/submit-appeal/expect-inquiry-last';
const draftStatementCommonGroundUrl = 'full-appeal/submit-appeal/draft-statement-common-ground';
const pageTitle = 'How many days would you expect the inquiry to last? - Appeal a planning decision - GOV.UK';
const pageHeading = 'How many days would you expect the inquiry to last?';
const textPageCaption = 'Tell us how you would prefer us to decide your appeal';
const textInquiry = 'I want to take part in the inquiry process - 123456789';
const validNumberDays = '10';

Given('appellant has completed full appeal eligibility journey',()=>{
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given("an Appellant or Agent is on the 'Why would you prefer an inquiry?'", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectInquiry().click();
  getSaveAndContinueButton().click();
 });
When("they enter text in text box and click 'Continue'", () => {
  textBoxInquiry().clear().type(textInquiry);
  getSaveAndContinueButton().click();
});
Then("'How many date would you expect the inquiry to last?' page is displayed", () => {
  cy.url().should('include', Url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText().should('contain', textPageCaption);
  cy.checkPageA11y();
  });
Given("an Appellant or Agent is on the 'How many days would you expect the inquiry to last?' page", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectInquiry().click();
  getSaveAndContinueButton().click();
  textBoxInquiry().clear().type(textInquiry);
  getSaveAndContinueButton().click();
});
When("they enter number of days into the box and click 'Continue'", () => {
  textBoxExpectDays().clear().type(validNumberDays);
  getSaveAndContinueButton().click();
});
Then("the page 'Upload your draft statement of common ground' page is displayed", () => {
  cy.url().should('include',draftStatementCommonGroundUrl);
});
Given("an Appellant or Agent has not provided any details", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectInquiry().click();
  textBoxInquiry().clear().type(textInquiry);
  getSaveAndContinueButton().click();
});
When("they click 'Continue'", () => {
  getSaveAndContinueButton().click();
});
Then('they are presented with an error message {string} in the expect inquiry last page', (errormessage) => {
  verifyErrorMessage(errormessage, expectedDaysErrorMessage, getErrorMessageSummary);
});
When("they click on the 'Back' link", () => {
  getBackLink().click();
});
Given("an Appellant or Agent has entered a {string} for the {string}", (value) => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectInquiry().click();
  getSaveAndContinueButton().click();
  textBoxInquiry().clear().type(textInquiry);
  getSaveAndContinueButton().click();
  if(value === "")
  {
    getSaveAndContinueButton().click();
  }
  else {
    textBoxExpectDays().clear().type(value);
  }
});
Then("they are presented with the 'Why would you prefer an inquiry?' page", () => {
  cy.url().should('include', whyInquiryUrl);
});
Then("they can see the text entered", () => {
  textBoxInquiry().should('contain', textInquiry);
})

