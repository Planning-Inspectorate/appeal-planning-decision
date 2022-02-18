import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getBackLink,
  getErrorMessageSummary
} from '../../../../../support/common-page-objects/common-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { contactDetailsLink } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  originalApplicantNo,
  originalApplicantYes, originalApplicationYourNameError,
} from '../../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { pageCaption} from '../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';


const url = 'full-appeal/submit-appeal/original-applicant';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const contactDetailsUrl = 'full-appeal/submit-appeal/contact-details';
const applicantNameUrl = 'full-appeal/submit-appeal/applicant-name';
const textPageCaption = 'Provide your contact details';
const pageTitle = "Was the planning application made in your name? - Appeal a planning decision - GOV.UK";
const pageHeading = 'Was the planning application made in your name?';

Given("an Appellant or Agent is on the Appeal a planning decision page",() => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});
When("the user click 'Provide your contact details' link",() => {
  contactDetailsLink().click();
});
Then("'Provide your contact details' page is displayed",() => {
  cy.url().should('contain', url);
});
When("they click the 'Continue'",() => {
  getSaveAndContinueButton().click();
 });

Given("an {string} is on the 'Was the planning application made in your name' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  contactDetailsLink().click();
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaption().should('contain', textPageCaption);
});
When("the user select 'Yes, the planning application was made in my name' and continue", () => {
  originalApplicantYes().click();
  getSaveAndContinueButton().click();
  });
When("the user select 'No, I'm acting on behalf of the applicant' and continue", () => {
  originalApplicantNo().click();
  getSaveAndContinueButton().click();
  });
Then("the user is taken to the next page to provide their 'Contact Details'", () => {
  cy.url().should('contain', contactDetailsUrl);
});
Then("are taken to the next page to provide the 'Applicant's name'", () => {
  cy.url().should('contain',applicantNameUrl);
});
When("no selection is made and they click Continue", () => {
  getSaveAndContinueButton().click();
});
Then('an error message {string} is displayed',(errorMessage)=> {
  verifyErrorMessage(errorMessage,originalApplicationYourNameError,getErrorMessageSummary);
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Appeal a planning decision' task list page", () => {
  cy.url().should('contain',taskListUrl)
});
