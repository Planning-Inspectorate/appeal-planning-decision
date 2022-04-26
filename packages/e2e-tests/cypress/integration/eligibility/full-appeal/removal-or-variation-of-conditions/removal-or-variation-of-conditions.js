import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import { selectLocalPlanningDepartment } from '../../../../support/before-you-start/local-planning-department';
import {
  errorMessageConditionsHouseholder,
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { pageCaptionText } from '../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import {
  selectNo,
  selectYes,
} from '../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { selectListedBuildingDecision } from '../../../../support/eligibility/listed-building/select-listed-building-decision';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { selectPlanningApplicationDecision } from '../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision';
import { allowedDatePart, getPastDate } from '../../../../support/common/getDate';
import { enterDateHouseholderDecisionReceived } from '../../../../support/eligibility/date-decision-received/enter-date-householder-decision-received';
import { getDate, getMonth, getYear } from 'date-fns';
import { enterDateDecisionReceived } from '../../../../support/eligibility/date-decision-received/enter-date-decision-received';
import { enterDateDecisionDue } from '../../../../support/eligibility/date-decision-due/enter-date-decision-due';
import { selectSiteOption } from '../../../../support/eligibility/appellant-selects-the-site/select-site-option';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getClaimingCostsErrorMessage } from '../../../../support/eligibility/page-objects/claiming-costs-po';
import {
  getPriorApprovalPlanningRadio,
  getRemovalOrVariationOfConditionsRadio,
} from '../../../../support/eligibility/page-objects/planning-application-type-po';

const pageHeading = 'Are the conditions for householder planning permission?';
const url = 'before-you-start/conditions-householder-permission';
const listedBuildingUrl = 'before-you-start/listed-building-householder';
const houseHolderGrantedOrRefusedUrl = 'before-you-start/granted-or-refused-householder';
const grantedOrRefusedUrl = 'before-you-start/granted-or-refused';
const enforcmentNoticeUrl = 'before-you-start/enforcement-notice';
const costsUrl = 'before-you-start/claiming-costs-householder';
const houseHolderTasklistUrl = 'appellant-submission/task-list';
const fullAppealTasklistUrl = 'full-appeal/submit-appeal/task-list';
const anyOfTheFollowingUrl = 'before-you-start/any-of-following';
const decisionDateUrl = 'before-you-start/decision-date';
const dateDecisionDueUrl = 'before-you-start/date-decision-due';
const pageTitle =
  'Are the conditions for householder planning permission? - Before you start - Appeal a planning decision - GOV.UK';

Given('the appellant is on the is your appeal about any of the following page',()=>{
  goToAppealsPage('before-you-start/local-planning-department');
  acceptCookiesBanner();
  selectLocalPlanningDepartment('System Test Borough Council');
  getSaveAndContinueButton().click();
});
When('they select {string} and click continue', (application_type) => {
  selectPlanningApplicationType(application_type);
  getSaveAndContinueButton().click();
});
Then(
  "they are presented with the next page 'Are the conditions for householder planning permission?'",
  () => {
    cy.url().should('contain', url);
    verifyPageHeading(pageHeading);
    verifyPageTitle(pageTitle);
    pageCaptionText().should('contain', 'Before you start');
  },
);
Given(
  "the appellant is on the 'Are the conditions for householder planning permission?' page",
  () => {
    goToAppealsPage('before-you-start/local-planning-department');
    acceptCookiesBanner();
    selectLocalPlanningDepartment('System Test Borough Council');
    getSaveAndContinueButton().click();
    selectPlanningApplicationType('Removal or variation of conditions');
    getSaveAndContinueButton().click();
    cy.url().should('contain', url);
  },
);
When('they select the option {string} and click Continue',(option)=>{
  if(option==='Yes')
  {
    selectYes().click();
  }
  else if(option==='No')
  {
    selectNo().click();
  }
  getSaveAndContinueButton().click();
});
Then("they are presented with the next page 'Is your appeal about a listed building'", () => {
  cy.url().should('contain', listedBuildingUrl);
});
Given("they selects the option as 'No' for listed building",()=>{
  cy.url().should('contain',listedBuildingUrl);
  selectListedBuildingDecision('No');
  getContinueButton().click();
});
Given("they are on the 'Was your planning application granted or refused' page for householder", () => {
  cy.url().should('contain', houseHolderGrantedOrRefusedUrl);
});
When('they select the option as {string} and click Continue', (decision) => {
  selectPlanningApplicationDecision(decision);
  getSaveAndContinueButton().click();
});
Then("they are navigated to the 'Appeal a householder planning decision' page",()=>{
  cy.url().should('contain','before-you-start/decision-date-householder');
  const validDate = getPastDate(allowedDatePart.WEEK, 7);
  enterDateHouseholderDecisionReceived( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
  getSaveAndContinueButton().click();
  cy.url().should('contain',enforcmentNoticeUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',costsUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',houseHolderTasklistUrl);
});
When('they selects the option as {string}', (decision)=>{
  selectPlanningApplicationDecision(decision);
  getContinueButton().click();
});
Then("they are navigated to 'Appeal a planning decision' page for {string}",(decision)=>{
  if(decision === 'Granted' ||  decision === 'Refused'){
    cy.url().should('contain',decisionDateUrl);
    const validDate = getPastDate(allowedDatePart.MONTH, 3);
    enterDateDecisionReceived( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
    getSaveAndContinueButton().click();
  }else if(decision === 'I have not received a decision'){
    cy.url().should('contain',dateDecisionDueUrl);
    const validDate = getPastDate(allowedDatePart.MONTH, 3);
    enterDateDecisionDue( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
    getSaveAndContinueButton().click();
  }
  cy.url().should('contain',enforcmentNoticeUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',fullAppealTasklistUrl);
});
Then("they are on the next page 'Was your planning application about any of the following'",()=> {
  cy.url().should('contain',anyOfTheFollowingUrl);
});
When("they select the option 'None of these'", () => {
  selectSiteOption('None of these');
  getSaveAndContinueButton().click();
});

Then("they are on the 'Was your planning application granted or refused' page",()=>{
  cy.url().should('contain',grantedOrRefusedUrl);
});
When("they click on the Continue button", () => {
  getSaveAndContinueButton().click();
});
Then('appellant sees an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, errorMessageConditionsHouseholder, getErrorMessageSummary);
});
When("appellant clicks on back link", () => {
  getBackLink().click();
});
Then('appellant is presented with the What type of planning application if your appeal about page',()=>{
  cy.url().should('contain','before-you-start/type-of-planning-application');
  getRemovalOrVariationOfConditionsRadio().should('be.checked');
})
