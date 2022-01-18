import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { appealDocumentsSectionLink } from '../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { pageCaption } from '../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { contactDetailsLink } from '../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  applicantCompanyName, behalfApplicantNameErrorMessage,
  originalApplicantName,
  originalApplicantNo,
} from '../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import {
  continueButton, getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';

const url = 'full-appeal/submit-appeal/applicant-name';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const originalApplicantUrl = 'full-appeal/submit-appeal/original-applicant';
const contactDetailsUrl = 'full-appeal/submit-appeal/contact-details'
const textPageCaption = 'Provide your contact details';
const pageTitle = "Was the planning application made in your name? - Appeal a planning decision - GOV.UK";
const pageHeading = 'Was the planning application made in your name?';
const applicantName = 'Original Applicant Teddy'
const companyName = 'ABC company limited'

Given("an Appellant or Agent is on the 'Was the original planning application made in your name?'",()=> {
  goToAppealsPage(taskListUrl);
  contactDetailsLink().click();
})
When("the option 'No, I'm acting on behalf of the applicant' is selected",()=> {
  originalApplicantNo().click();
})
Then("the next page to provide the Applicant's name is displayed", () => {
  cy.url().should('contain',originalApplicantUrl);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaption().should('contain', textPageCaption);
});

Given("an agent is on the 'What is the applicant’s name' page", () => {
  goToAppealsPage(taskListUrl);
  contactDetailsLink().click();
  originalApplicantNo().click();
  continueButton().click();
  cy.url().should('contain', url);
});

Then("the appellant’s details should be saved and the 'Contact details' page is displayed", () => {
  cy.url().should('contain', contactDetailsUrl);
});
When( "the Applicant’s name and Company name are provided and select 'Continue'", () => {
  originalApplicantName().clear().type(applicantName);
  applicantCompanyName().clear().type(companyName);
  continueButton().click();
});
When("they click on continue without enter any information", () => {
  continueButton().click();
})
Then('they are presented with the error {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, behalfApplicantNameErrorMessage, getErrorMessageSummary);
})
When("they enter only one letter and click continue", () => {
  originalApplicantName().clear().type('x');
  continueButton().click();
})

When("they enter {string} and click continue", (name) => {
  originalApplicantName().clear().type(name);
  continueButton().click();
})
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain', taskListUrl);
})
