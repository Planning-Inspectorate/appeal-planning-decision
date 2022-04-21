import { declarationPageMethodsAppellant } from '../../../../support/full-appeal/appeals-service/declarationPageMethodsAppellant';
import {
  confirmAndSubmitAppealButton, getFileUploadButton,
  getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import {
  aboutAppealSiteSectionLink, appealDocumentsSectionLink, checkYourAnswersLink,
  contactDetailsLink,
  grantedOrRefused,
  noneOfTheseOption, planningApplicationDocumentsLink,
} from '../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { allowedDatePart, getPastDate } from '../../../../support/common/getDate';
import { enterDateDecisionDue } from '../../../../support/eligibility/date-decision-due/enter-date-decision-due';
import { getDate, getMonth, getYear } from 'date-fns';
import { selectNo, selectYes } from '../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import {
  contactDetailsCompanyName,
  contactDetailsEmail,
  contactDetailsFullName, originalApplicantName, originalApplicantNo,
  originalApplicantYes,
} from '../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import { provideAddressLine1 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { linkDecideYourAppeal } from '../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import { selectWrittenRepresentations } from '../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import { planningApplicationNumber } from '../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import { submitADesignStNo } from '../../../../support/full-appeal/appeals-service/page-objects/design-access-statement-submitted-po';
import { checkboxConfirmSensitiveInfo } from '../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';
import { declariationPageMethodsAgent } from '../../../../support/full-appeal/appeals-service/declariationPageMethodsAgent';

const declarationUrl = 'full-appeal/submit-appeal/declaration';
const appealSubmittedUrl = 'full-appeal/submit-appeal/appeal-submitted';
const applicantName = 'Original Applicant Teddy';
const AgentFullNameText = 'Agent Zoopla';
const AgentCompanyNameText = 'Agent Zoopla Test Company Ltd';
const AgentEmailText = 'agent-zoopla@hotmail.com';


const goToMultipleAppealsPage = (url, applicationType) => {
  goToAppealsPage(url);
  cy.url().should('include', url);
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType(applicationType);
  getSaveAndContinueButton().click();
  noneOfTheseOption().click();
  getSaveAndContinueButton().click();
  grantedOrRefused().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/decision-date');
  const validDate = getPastDate(allowedDatePart.MONTH, 1);
  enterDateDecisionDue( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/enforcement-notice');
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'full-appeal/submit-appeal/task-list');
  cy.checkPageA11y();
};
const declarationPageMethodsMultipleAppealsAppellant = () => {
  goToMultipleAppealsPage('before-you-start/local-planning-department','Full planning');
//contact Details section
  contactDetailsLink().click();
  originalApplicantYes().click();
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type('Original Applicant Teddy');
  contactDetailsEmail().clear().type('teddy@gmail.com');
  getSaveAndContinueButton().click();
//site address section
  aboutAppealSiteSectionLink().click();
  provideAddressLine1('101 Bradmore Way, Reading');
  providePostcode('RG6 1DC');
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
//decide your appeal section
  linkDecideYourAppeal().click();
  selectWrittenRepresentations().click();
  getSaveAndContinueButton().click();
//planning application section
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  getSaveAndContinueButton().click();
  planningApplicationNumber().type('PNO-1001');
  getSaveAndContinueButton().click();
  getFileUploadButton().attachFile('upload-file-valid.pdf');
  getSaveAndContinueButton().click();
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  getSaveAndContinueButton().click();
//appeal statement section
  appealDocumentsSectionLink().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
//check your answers
  checkYourAnswersLink().click();
};
const declarationPageMethodsMultipleAppealsAgent = () => {
  goToMultipleAppealsPage('before-you-start/local-planning-department','Full planning');
//contact Details section for Agent
  contactDetailsLink().click();
  originalApplicantNo().click();
  getSaveAndContinueButton().click();
  originalApplicantName().clear().type(applicantName);
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type(AgentFullNameText);
  contactDetailsCompanyName().clear().type(AgentCompanyNameText);
  contactDetailsEmail().clear().type(AgentEmailText);
  getSaveAndContinueButton().click();
//site address section
  aboutAppealSiteSectionLink().click();
  provideAddressLine1('101 Bradmore Way, Reading');
  providePostcode('RG6 1DC');
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
//decide your appeal section
  linkDecideYourAppeal().click();
  selectWrittenRepresentations().click();
  getSaveAndContinueButton().click();
//planning application section
  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  getSaveAndContinueButton().click();
  planningApplicationNumber().type('PNO-1001');
  getSaveAndContinueButton().click();
  getFileUploadButton().attachFile('upload-file-valid.pdf');
  getSaveAndContinueButton().click();
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  getSaveAndContinueButton().click();
//appeal statement section
  appealDocumentsSectionLink().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
//check your answers
  checkYourAnswersLink().click();
}
Given("an Appellant is on the 'Declaration' page", () => {
  declarationPageMethodsAppellant();
  getSaveAndContinueButton().click();
  cy.url().should('include', declarationUrl);
});
When("they click on 'Confirm and submit appeal' button", () => {
  confirmAndSubmitAppealButton().click();
});
Then("they are taken to the 'Appeal submitted' page", () => {
  cy.url().should('include', appealSubmittedUrl);
});
When("the Appellant start their second Appeal in the same browser", () => {
  declarationPageMethodsMultipleAppealsAppellant();
  getSaveAndContinueButton().click();
  cy.url().should('include', declarationUrl);
});
When("the Appellant start their third Appeal in the same browser", () => {
  goToAppealsPage('before-you-start/local-planning-department');
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
});
Then("they are on the 'What type of planning application is your appeal about?' page", () => {
  cy.url().should('include', 'before-you-start/type-of-planning-application');
});

Given("an Agent is on the 'Declaration' page", () => {
  declariationPageMethodsAgent();
  getSaveAndContinueButton().click();
  cy.url().should('include', declarationUrl);
});
When("the Agent start their second Appeal in the same browser", () => {
  declarationPageMethodsMultipleAppealsAgent();
  getSaveAndContinueButton().click();
  cy.url().should('include', declarationUrl);
});
When("the Agent start their third Appeal in the same browser", () => {
  goToAppealsPage('before-you-start/local-planning-department');
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
});
