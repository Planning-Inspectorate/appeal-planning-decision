import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  appealSubmittedHeading,
  confirmAndSubmitAppealButton, declarationWarningText, getBackLink,
  getSaveAndContinueButton, privacyNoticeLink, termAndConditionsLink,
} from '../../../../support/common-page-objects/common-po';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import {
  aboutAppealSiteSectionLink,
  checkYourAnswersLink, contactDetailsLink, grantedOrRefused, noneOfTheseOption,
} from '../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { provideAddressLine1 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { selectNo, selectYes } from '../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { enterLocalPlanningDepart } from '../../../../support/eligibility/local-planning-depart/enter-local-planning-depart';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import {
  applicantCompanyName,
  contactDetailsCompanyName, contactDetailsEmail,
  contactDetailsFullName, originalApplicantName, originalApplicantNo,
  originalApplicantYes,
} from '../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import { allowedDatePart, getPastDate } from '../../../../support/common/getDate';
import { enterDateDecisionDue } from '../../../../support/eligibility/date-decision-due/enter-date-decision-due';
import { getDate, getMonth, getYear } from 'date-fns';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import {
  backButton,
  sectionName,
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { goToFullAppealSubmitAppealTaskList } from '../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { declariationPageMethodsAgent } from '../../../../support/full-appeal/appeals-service/declariationPageMethodsAgent';
import { declarationPageMethodsAppellant } from '../../../../support/full-appeal/appeals-service/declarationPageMethodsAppellant';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';

const url = 'full-appeal/submit-appeal/declaration?';
const checkYourAnswersUrl = 'full-appeal/submit-appeal/check-answers';
const appealSubmittedUrl = 'full-appeal/submit-appeal/appeal-submitted';
const textPageCaption = 'Check your answers and submit your appeal';
const pageTitle = 'Declaration - Appeal a planning decision - GOV.UK';
const pageHeading = 'Declaration';
const submittedPageTitle = 'Appeal Submitted - Check your answers and submit your appeal - Appeal a planning decision - GOV.UK';

Given("an Appellant is on the 'Check your answers' page", () => {
    declarationPageMethodsAppellant();
});
When("they click on 'Continue' button", () => {
  getSaveAndContinueButton().click();
})
Then("they are taken to the 'Declaration' page with the Declaration text", () => {
  cy.url().should('contain', url);
  privacyNoticeLink().should('exist');
  termAndConditionsLink().should('exist');
  declarationWarningText().should('exist');
})
Given("an Appellant is ready to submit their appeal", () => {
  declarationPageMethodsAppellant();
  cy.url().should('contain', checkYourAnswersUrl);
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  sectionName(textPageCaption).should('exist');
  cy.checkPageA11y();
 })
When("they click on 'Confirm and submit appeal'", () => {
  confirmAndSubmitAppealButton().click();
})
Then("they are taken to the next page 'Appeal Submitted'", () => {
  cy.url().should('contain', appealSubmittedUrl);
  verifyPageTitle(submittedPageTitle);
  appealSubmittedHeading().should('exist');
  getBackLink().should('not.exist');
  cy.checkPageA11y();
})

Given("an Agent is on the 'Check your answers' page", () => {
  declariationPageMethodsAgent();
  cy.url().should('contain', checkYourAnswersUrl);
  cy.checkPageA11y();
})
Given("an Agent is ready to submit their appeal", () => {
  declariationPageMethodsAgent();
  cy.url().should('contain', checkYourAnswersUrl);
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
})
