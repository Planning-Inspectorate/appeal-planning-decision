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
import { backButton } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

const url = 'full-appeal/submit-appeal/declaration?';
const localPlanningDept = 'before-you-start/local-planning-depart';
const checkYourAnswersUrl = 'full-appeal/submit-appeal/check-answers';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const agriculturalHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const visibleFromRoadUrl = 'full-appeal/submit-appeal/visible-from-road';
const healthAndSafetyIssuesUrl = 'full-appeal/submit-appeal/health-safety-issues';
const appealSubmittedUrl = 'full-appeal/submit-appeal/appeal-submitted';
const textPageCaption = 'Check your answers and submit your appeal';
const pageTitle = 'Declaration - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Declaration';
const submittedPageTitle = 'Appeal Submitted - Check your answers and submit your appeal - Appeal a planning decision - GOV.UK';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const departmentName = 'System Test Borough Council';
const applicationType = 'Full planning';
const originalAppellantFullNameText = 'Original Appellant Teddy';
const originalAppellantCompanyNameText = 'Original Appellant Test Company Ltd';
const originalAppellantEmailText = 'original-appellant@gmail.com';
const applicantName = 'Sun the Original Applicant';
const companyName = 'ABC Corporation Ltd';

const declariationPageMethodsAgent = () => {
  goToAppealsPage(localPlanningDept);
  acceptCookiesBanner();
  enterLocalPlanningDepart(departmentName);
  getSaveAndContinueButton().click();
  selectPlanningApplicationType(applicationType);
  getSaveAndContinueButton().click();
  noneOfTheseOption().click();
  getSaveAndContinueButton().click();
  grantedOrRefused().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/decision-date');
  const validDate = getPastDate(allowedDatePart.MONTH, 1);
  enterDateDecisionDue( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/enforcement-notice');
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  contactDetailsLink().click();
  originalApplicantNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'full-appeal/submit-appeal/applicant-name');
  originalApplicantName().clear().type(applicantName);
  applicantCompanyName().clear().type(companyName);
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type(originalAppellantFullNameText);
  contactDetailsEmail().clear().type(originalAppellantEmailText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalHoldingUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', visibleFromRoadUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', healthAndSafetyIssuesUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  checkYourAnswersLink().click();
}

const declarationPageMethods = () => {
  goToAppealsPage(localPlanningDept);
  acceptCookiesBanner();
  enterLocalPlanningDepart(departmentName);
  getSaveAndContinueButton().click();
  selectPlanningApplicationType(applicationType);
  getSaveAndContinueButton().click();
  noneOfTheseOption().click();
  getSaveAndContinueButton().click();
  grantedOrRefused().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/decision-date');
  const validDate = getPastDate(allowedDatePart.MONTH, 1);
  enterDateDecisionDue( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/enforcement-notice');
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  contactDetailsLink().click();
  originalApplicantYes().click();
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type(originalAppellantFullNameText);
  contactDetailsEmail().clear().type(originalAppellantEmailText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalHoldingUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', visibleFromRoadUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', healthAndSafetyIssuesUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  checkYourAnswersLink().click();
}

Given("an Appellant is on the 'Check your answers' page", () => {
    declarationPageMethods();
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
 declarationPageMethods();
  cy.url().should('contain', checkYourAnswersUrl);
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
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
