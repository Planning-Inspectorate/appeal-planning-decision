import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getSaveAndContinueButton,
  sectionName,
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { contactDetailsLink } from '../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  applicantCompanyName, behalfApplicantNameErrorMessage,
  contactDetailsCompanyName, contactDetailsEmail,
  contactDetailsFullName, EmailErrorMessage, fullnameErrorMessage, originalApplicantName, originalApplicantNo,
  originalApplicantYes,
} from '../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import { continueButton, getBackLink, getErrorMessageSummary } from '../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { provideAddressLine1 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine2';
import { provideTownOrCity } from '../../../../support/common/appeal-submission-appeal-site-address/provideTownOrCity';
import { provideCounty } from '../../../../support/common/appeal-submission-appeal-site-address/provideCounty';
import { providePostcode } from '../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { errorFileUploadField } from '../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';

const url = 'full-appeal/submit-appeal/contact-details';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const originalApplicantUrl = 'full-appeal/submit-appeal/original-applicant';
const applicantNameUrl = 'full-appeal/submit-appeal/applicant-name';
const textPageCaption = 'Provide your contact details';
const pageTitle = "Contact details - Appeal a planning decision - GOV.UK";
const pageHeading = 'Contact details';
const originalAppellantFullNameText = 'Original Appellant Teddy';
const originalAppellantCompanyNameText = 'Original Appellant Test Company Ltd';
const originalAppellantEmailText = 'original-appellant@gmail.com';
const applicantName = 'Original Applicant Teddy';
const companyName = 'ABC company limited';
const AgentFullNameText = 'Agent Zoopla';
const AgentCompanyNameText = 'Agent Zoopla Test Company Ltd';
const AgentEmailText = 'agent-zoopla@hotmail.com';

Given("an Appellant is on the 'Provide your contact details' page", () => {
 goToAppealsPage(originalApplicantUrl);
  originalApplicantYes().click();
  continueButton().click();
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading)
  sectionName(textPageCaption).should('exist');
});
When("appellant enters their 'full name, company name, email address'", () => {
  contactDetailsFullName().clear().type(originalAppellantFullNameText);
  contactDetailsCompanyName().clear().type(originalAppellantCompanyNameText);
  contactDetailsEmail().clear().type(originalAppellantEmailText);
});
When("they select the 'Continue' button",()=> {
  continueButton().click();
});
Then("they return to the task list on the 'Appeal a planning decision' page", () => {
  cy.url().should('contain', taskListUrl);
});
Given("an Agent is on the 'Provide your contact details' page", () => {
  goToAppealsPage(originalApplicantUrl);
  originalApplicantNo().click();
  continueButton().click();
  cy.url().should('contain',applicantNameUrl)
  originalApplicantName().clear().type(applicantName);
  applicantCompanyName().clear().type(companyName);
  continueButton().click();
})

When("agent enters their 'full name, company name, email address'", () => {
  contactDetailsFullName().clear().type(AgentFullNameText);
  contactDetailsCompanyName().clear().type(AgentCompanyNameText);
  contactDetailsEmail().clear().type(AgentEmailText);
});
Given("the appellant or agent has or has not provided {string} in the {string} text box", () => {

})
Then('they are presented with the error {string}', (errorMessage) => {
  switch (errorMessage) {
    case 'Enter your full name':
     verifyErrorMessage(errorMessage, fullnameErrorMessage, getErrorMessageSummary);
      break;
    case 'Name must be between 2 and 80 characters':
     verifyErrorMessage(errorMessage, fullnameErrorMessage, getErrorMessageSummary);
      break;
    case 'Name must only include letters a to z, hyphens, spaces and apostrophes':
      verifyErrorMessage(errorMessage, fullnameErrorMessage, getErrorMessageSummary);
      break;
    case 'Enter your email address':
      verifyErrorMessage(errorMessage, EmailErrorMessage, getErrorMessageSummary);
      break;
    case 'Enter an email address in the correct format, like name@example.com':
      verifyErrorMessage(errorMessage, EmailErrorMessage, getErrorMessageSummary);
      break;
  }
})
Given("the appellant or agent is on the 'Provide your contact details' page", () => {
  goToAppealsPage(originalApplicantUrl);
  originalApplicantYes().click();
  continueButton().click();
  cy.url().should('contain', url);
})

When( 'they have or have not provided {string} in the {string} text box', (value, field) => {
  switch (value,field) {
   case 'Your full name':
      contactDetailsFullName().type(`{selectall}{backspace}${value}`);
      contactDetailsEmail().clear().type(AgentEmailText);
      continueButton().click();
      break;
    case 'Your full name':
      contactDetailsFullName().type(`{selectall}{backspace}${value}`);
      contactDetailsEmail().clear().type(AgentEmailText);
      continueButton().click();
      break;
    case 'Your email address':
      contactDetailsFullName().clear().type(AgentFullNameText);
      contactDetailsEmail().type(`{selectall}{backspace}${value}`);
      continueButton().click();
      break;
    case 'Your email address':
      contactDetailsFullName().clear().type(AgentFullNameText);
      contactDetailsEmail().type(`{selectall}{backspace}${value}`);
      continueButton().click();
      break;
      }
} );
Then("they are presented with the 'Was the planning application made in your name?' page", () => {
  cy.url().should('contain', originalApplicantUrl);
})
Then("they are presented with the 'What is the applicant's name?' page", () => {
  cy.url().should('contain', applicantNameUrl);
})
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then('an error message {string} is displayed', (errorMessage) => {
  verifyErrorMessage(errorMessage,fullnameErrorMessage, getErrorMessageSummary);
});
Given("the Agent or Appellant is on the 'Provide your contact details' page", () => {
  goToAppealsPage(originalApplicantUrl);
  originalApplicantYes().click();
  continueButton().click();
  cy.url().should('contain', url);
  })
When("they have not provided the applicant's name", () => {
  contactDetailsEmail().clear().type(AgentEmailText);
  continueButton().click();
})
