import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { linkDecideYourAppeal } from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import {
  selectHearing,
  textBoxWhyHearing, whyHearingErrorMessage,
} from '../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { pageCaptionText } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';

const taskListUrl = 'full-appeal/submit-appeal/task-list';
const decideAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const Url = 'full-appeal/submit-appeal/why-hearing';
const draftStatementUrl = 'full-appeal/submit-appeal/draft-statement-common-ground';
const textPageCaption = 'Tell us how you would prefer us to decide your appeal';
const pageTitle = 'Why would you prefer a hearing? - Appeal a planning decision - GOV.UK';
const pageHeading = 'Why would you prefer a hearing?';
const textHearing = 'I want to provide the facts of the Appeal for the formal decision';

Given('appellant has completed full appeal eligibility journey',() => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given('an Appellant or Agent is on the How would you prefer us to decide your appeal for hearing', () => {
  cy.url().should('contain', taskListUrl);
  linkDecideYourAppeal().click();
  cy.url().should('include', decideAppealUrl);
});
When("they select the option 'Hearing'", () => {
  selectHearing().click();
  getSaveAndContinueButton().click();
});
Then("'Why would you prefer a hearing?' page is displayed", () => {
  cy.url().should('include', Url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText().should('contain', textPageCaption);
  cy.checkPageA11y();
});
Given("an Appellant or Agent is on the 'Why would your prefer a hearing?' page", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectHearing().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', Url);
});
When("they enter text into the box and click 'Continue'", () => {
  textBoxWhyHearing().clear().type(textHearing);
  getSaveAndContinueButton().click();
});
Then("the page 'Upload your draft statement of common ground' page is displayed", () => {
  cy.url().should('include', draftStatementUrl);
});
Given("an Appellant or Agent has not provided any details", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectHearing().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', Url);
});
Given("an appellant agent has entered more than 255 characters into the text box", () => {
  cy.url().should('include', taskListUrl);
  linkDecideYourAppeal().click();
  selectHearing().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', Url);
  const count = 255;
  const value = 'x'.repeat(count+1);
  textBoxWhyHearing().clear().type(value);
});
When("they click 'Continue'", () => {
  getSaveAndContinueButton().click();
});
Then('they are presented with an error message {string}', (errormessage) => {
  verifyErrorMessage(errormessage,whyHearingErrorMessage,getErrorMessageSummary);
});
When("they click on the 'Back' link", () => {
  getBackLink().click();
});
Then("they are presented with the 'How would you prefer us to decide your appeal' page", () => {
  cy.url().should('include', decideAppealUrl);
})
