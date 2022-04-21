import {addMonths, format, getDate, getMonth, getYear} from 'date-fns';
import { Given,When,Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { getErrorMessageSummary } from '../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import { getFutureDate, getPastDate, allowedDatePart } from '../../../../support/common/getDate';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import {
  selectPlanningApplicationType
} from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import { selectSiteOption } from '../../../../support/eligibility/appellant-selects-the-site/select-site-option';
import {
  selectPlanningApplicationDecision
} from '../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision';
import {
  enterDateDecisionDue,
  verifyHighlightsDecisionDue,
} from '../../../../support/eligibility/date-decision-due/enter-date-decision-due';
import {
  getDateDecisionDueDay,
  getPlanningApplicationDecisionError,
} from '../../../../support/eligibility/page-objects/date-decision-due-po';
import {clickContinueButton} from "../../../../support/common/clickContinueButton";
import {getAppealDeadline} from "../../../../support/eligibility/page-objects/shutter-page-po";
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { selectNo } from '../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';

const pageHeading = 'What date was your decision due?';
const pageTitle = 'What date was your decision due? - Before you start - Appeal a planning decision - GOV.UK';
const url = `before-you-start/date-decision-due`;
const enforcementNoticePageUrl = '/before-you-start/enforcement-notice';
const grantedOrRefusedPageUrl = '/before-you-start/granted-or-refused';
const shutterPageUrl = '/before-you-start/you-cannot-appeal';
let pastDate;

Given('appellant navigates to decision date page for {string}',(application_type)=>{
  goToAppealsPage('before-you-start/local-planning-department');
  acceptCookiesBanner();
  getLocalPlanningDepart().select('System Test Borough Council');
  getContinueButton().click();
  selectPlanningApplicationType(application_type);
  clickContinueButton();
  if(application_type==='Prior approval'){
    selectNo().click();
    clickContinueButton();
  }
  if(application_type==='Removal or variation of conditions'){
    selectNo().click();
    clickContinueButton();
  }
  selectSiteOption('None of these');
  clickContinueButton();
  selectPlanningApplicationDecision('I have Not Received a Decision');
  clickContinueButton();
});

Given('appellant navigates to date decision due page', () =>{
  goToAppealsPage('before-you-start/local-planning-department');
  getLocalPlanningDepart().select('System Test Borough Council');
  getContinueButton().click();
  selectPlanningApplicationType('Full planning');
  clickContinueButton();
  selectSiteOption('None of these');
  clickContinueButton();
  selectPlanningApplicationDecision('I have Not Received a Decision');
  clickContinueButton();
  cy.url().should('contain', url);
});

Given('appellant is on the what date was the decision due page',()=>{
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  cy.checkPageA11y();
});

When('appellant enters the date within 6 months when they were due a decision', () => {
  const validDate = getPastDate(allowedDatePart.MONTH, 3);
  enterDateDecisionDue( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
});

When('appellant enters a past date of over 6 months', () => {
  pastDate = getPastDate(allowedDatePart.MONTH, 7);
  enterDateDecisionDue( {day: ("0" + getDate(pastDate)).slice(-2), month: ("0" + (getMonth(pastDate)+1)).slice(-2) , year: getYear(pastDate) } );
});

When('appellant clicks on continue', () => {
 clickContinueButton();
});

When('appellant enters date decision due of {string}-{string}-{string}', (day, month, year) => {
  enterDateDecisionDue( { day, month, year } );
});

When('appellant enters future date decision due of {string}-{string}', (datePart, value) => {
  const futureDate = getFutureDate(datePart, value);
  enterDateDecisionDue( {day: ("0" + getDate(futureDate)).slice(-2), month: ("0" + (getMonth(futureDate)+1)).slice(-2) , year: getYear(futureDate) } );
});

When('appellant selects the back button', () => {
  getBackLink().click();
});

Then('they are navigated to the have you received an enforcement notice page', () => {
  cy.url().should('contain', enforcementNoticePageUrl);
});

Then('appellant gets routed to a page which notifies them that they cannot appeal', () => {
  cy.url().should('contain', shutterPageUrl);
  pastDate = format(addMonths(pastDate,6),'dd MMMM yyyy');
  getAppealDeadline().should('contain', '6 months');
  getAppealDeadline().should('contain',pastDate);
});

Then('progress is halted with an error: {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getPlanningApplicationDecisionError, getErrorMessageSummary);
});

Then('the correct input {string} is highlighted', (highlights) => {
  verifyHighlightsDecisionDue(highlights);
});

Then('appellant is navigated to the granted or refused page', () => {
  cy.url().should('contain', grantedOrRefusedPageUrl);
});

Then('decision due date they have inputted will not be saved', () => {
  cy.url().should('contain', grantedOrRefusedPageUrl);
  selectPlanningApplicationDecision('I have Not Received a Decision');
  clickContinueButton();
  getDateDecisionDueDay().should('have.text', '');
});
