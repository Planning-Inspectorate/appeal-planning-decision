import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { pageCaption } from '../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { contactDetailsLink } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  applicantCompanyName, behalfApplicantNameErrorMessage,
  originalApplicantName,
  originalApplicantNo,
} from '../../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import {
   getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';

const url = 'full-appeal/submit-appeal/applicant-name';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const originalApplicantUrl = 'full-appeal/submit-appeal/original-applicant';
const contactDetailsUrl = 'full-appeal/submit-appeal/contact-details'
const textPageCaption = 'Provide your contact details';
const pageTitle = "What is the applicant's name? - Appeal a planning decision - GOV.UK";
const pageHeading = "What is the applicant's name?";
const applicantName = 'Original Applicant Teddy'
const companyName = 'ABC company limited'

Given("Agent is on the 'Was the original planning application made in your name?'",()=> {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  contactDetailsLink().click();
  cy.url().should('contain',originalApplicantUrl);
})
When("the option 'No, I'm acting on behalf of the applicant' is selected",()=> {
  originalApplicantNo().click();
  getSaveAndContinueButton().click();
})
Then("the next page to provide the Applicant's name is displayed", () => {
  cy.url().should('contain',url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaption().should('contain', textPageCaption);
});

Given("an Agent is on the 'What is the applicant’s name' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  contactDetailsLink().click();
  originalApplicantNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
});

Then("the appellant’s details should be saved and the 'Contact details' page is displayed", () => {
  cy.url().should('contain', contactDetailsUrl);
});
When( "the Applicant’s name and Company name are provided and select 'Continue'", () => {
  originalApplicantName().clear().type(applicantName);
  applicantCompanyName().clear().type(companyName);
  getSaveAndContinueButton().click();
});
When("they click on continue without entering any information", () => {
  getSaveAndContinueButton().click();
})
Then('they are presented with the error {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, behalfApplicantNameErrorMessage, getErrorMessageSummary);
})
When("they enter only one letter and click continue", () => {
  originalApplicantName().clear().type('x');
  getSaveAndContinueButton().click();
})

When("they enter {string} and click continue", (name) => {
  originalApplicantName().clear().type(name);
  getSaveAndContinueButton().click();
})
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("Agent is on the previous page 'Was the original planning application made in your name?'", () => {
  cy.url().should('contain',originalApplicantUrl);
})
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain', taskListUrl);
})
