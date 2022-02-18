import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  CheckYourAnswersLink, getPageCaption, getPlanningAppMadeInYourName, getSectionHeading, yourContactDetails,
} from '../../../../../support/full-appeal/appeals-service/page-objects/check-your-answers-po';
import { getBackLink } from '../../../../../support/common-page-objects/common-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { acceptCookiesBanner } from '../../../../../support/common/accept-cookies-banner';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { contactDetailsLink } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  contactDetailsCompanyName, contactDetailsEmail,
  contactDetailsFullName,
  originalApplicantName,
  originalApplicantNo, originalApplicantYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

const url = 'full-appeal/submit-appeal/check-answers';
const pageTitle = 'Check your answers - Appeal a planning decision - GOV.UK';
const pageHeading = 'Check your answers';
const applicantName = 'Original applicant Teddy';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const AgentFullNameText = 'Agent Zoopla';
const AgentCompanyNameText = 'Agent Zoopla Test Company Ltd';
const AgentEmailText = 'agent-zoopla@hotmail.com';
const originalAppellantFullNameText = 'Original Appellant Teddy';
const originalAppellantCompanyNameText = 'Original Appellant Test Company Ltd';
const originalAppellantEmailText = 'original-appellant@gmail.com';

const appellantMethods = () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  contactDetailsLink().click();
  originalApplicantYes().click();
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type(originalAppellantFullNameText);
  contactDetailsCompanyName().clear().type(originalAppellantCompanyNameText);
  contactDetailsEmail().clear().type(originalAppellantEmailText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
}
const agentMethods = () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  contactDetailsLink().click();
  originalApplicantNo().click();
  getSaveAndContinueButton().click();
  originalApplicantName().clear().type(applicantName);
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type(AgentFullNameText);
  contactDetailsCompanyName().clear().type(AgentCompanyNameText);
  contactDetailsEmail().clear().type(AgentEmailText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
}

Given("the appellant is on the 'Appeal a planning decision' page",()=> {
  appellantMethods();
})
When("they click on 'Check your answers and submit your appeal' link",()=> {
  CheckYourAnswersLink().click();
})

Then('the information {string} have inputted will be displayed',(user)=> {
  switch (user) {
    case 'Agent':
      cy.url().should( 'contain', url);
      verifyPageTitle(pageTitle);
      verifyPageHeading(pageHeading);
      cy.checkPageA11y();
      getPlanningAppMadeInYourName().should( 'exist' );
      getPlanningAppMadeInYourName().siblings( 'dd' ).should( 'contain', "No, I'm an agent acting on behalf of the applicant" );
      yourContactDetails().should( 'contain', 'Your contact details' );
      break;
    case 'Appellant':
      cy.url().should( 'contain', url );
      getPlanningAppMadeInYourName().should( 'exist' );
      getPlanningAppMadeInYourName().siblings( 'dd' ).should( 'contain', "Yes, the planning application was made in my name" );
      yourContactDetails().should( 'contain', 'Your contact details' );
      break;
  }
})

Given("the agent is on the 'Appeal a planning decision' page",()=> {
  agentMethods();
})
Given("the {string} is on the 'Check your answers' page",(user)=> {
  switch (user){
    case 'agent':
      agentMethods();
      CheckYourAnswersLink().click();
      break;
    case 'appellant':
      appellantMethods();
      CheckYourAnswersLink().click();
      break;
  }
})
When("they select the 'Back' link",()=> {
  getBackLink().click();
})
Then("the {string} is on the 'Appeal a planning decision' page",()=> {
  cy.url().should('contain',taskListUrl);
})
