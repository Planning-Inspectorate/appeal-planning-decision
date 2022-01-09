import { getDate, getMonth, getYear } from 'date-fns';
import { Given,When,Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPageHeading } from '../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../support/common/verify-page-title';
import { getErrorMessageSummary } from '../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../support/common/verify-error-message';
import { getBackLink } from '../../../support/common-page-objects/common-po';
import { acceptCookiesBanner } from '../../../support/common/accept-cookies-banner';
import { getContinueButton } from '../../../support/householder-planning/appeals-service/page-objects/common-po';
import { getFutureDate, getPastDate, allowedDatePart } from '../../../support/common/getDate';
import { goToAppealsPage } from '../../../support/common/go-to-page/goToAppealsPage';
import {
  selectPlanningApplicationType
} from '../../../support/eligibility/planning-application-type/select-planning-application-type';
import { selectSiteOption } from '../../../support/eligibility/appellant-selects-the-site/select-site-option';
import {
  selectPlanningApplicationDecision
} from '../../../support/eligibility/granted-or-refused-application/select-planning-application-decision';
import {
  enterDateDecisionDue,
  verifyHighlights,
} from '../../../support/eligibility/date-decision-due/enter-date-decision-due';
import {
  getDateDecisionDueDay,
  getPlanningApplicationDecisionError,
} from '../../../support/eligibility/page-objects/date-decision-due-po';

const pageHeading = 'What date was the decision due?';
const pageTitle = 'What date was the decision due? - Before you start - Appeal a planning decision - GOV.UK';
const url = `before-you-start/date-decision-due`;
const typeOfPlanningPageUrl = `before-you-start/type-of-planning-application`;
const enforcementNoticePageUrl = '/before-you-start/enforcement-notice';
const grantedOrRefusedPageUrl = '/before-you-start/granted-or-refused';
const shutterPageUrl = '/before-you-start/you-cannot-appeal';

Given('appellant navigates to decision date page for {string}',(application_type)=>{
  goToAppealsPage(typeOfPlanningPageUrl);
  selectPlanningApplicationType(application_type);
  getContinueButton().click();
  selectSiteOption('None of these');
  getContinueButton().click();
  selectPlanningApplicationDecision('I have Not Received a Decision');
  getContinueButton().click();
});

Given('appellant navigates to date decision due page', () =>{
  goToAppealsPage(url);
});

Given('appellant is on the what date was the decision due page',()=>{
  acceptCookiesBanner();
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

When('appellant enters the date within 6 months when they were due a decision', () => {
  const validDate = getPastDate(allowedDatePart.MONTH, 3);
  enterDateDecisionDue( {day: getDate(validDate), month: getMonth(validDate), year: getYear(validDate) } );
});

When('appellant enters a past date of over 6 months', () => {
  const pastDate = getPastDate(allowedDatePart.MONTH, 7);
  enterDateDecisionDue( {day: getDate(pastDate), month: getMonth(pastDate) + 1, year: getYear(pastDate) } );
});

When('appellant clicks on continue', () => {
  getContinueButton().click();
});

When('appellant enters date decision due of {string}-{string}-{string}', (day, month, year) => {
  enterDateDecisionDue( { day, month, year } );
});

When('appellant enters future date decision due of {string}-{string}', (datePart, value) => {
  const futureDate = getFutureDate(datePart, value);
  enterDateDecisionDue( {day: getDate(futureDate), month: getMonth(futureDate) + 1, year: getYear(futureDate) } );
});

When('appellant selects the back button', () => {
  getBackLink().click();
});

Then('they are navigated to the have you received an enforcement notice page', () => {
  cy.url().should('contain', enforcementNoticePageUrl);
});

Then('appellant gets routed to a page which notifies them that they cannot appeal', () => {
  cy.url().should('contain', shutterPageUrl);
});

Then('progress is halted with an error: {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getPlanningApplicationDecisionError, getErrorMessageSummary);
});

Then('the correct input {string} is highlighted', (highlights) => {
  verifyHighlights(highlights);
});

Then('appellant is navigated to the granted or refused page', () => {
  cy.url().should('contain', grantedOrRefusedPageUrl);

  selectPlanningApplicationDecision('I have Not Received a Decision');
  getContinueButton().click();
});

Then('decision due date they have inputted will not be saved', () => {
  getDateDecisionDueDay().should('have.text', '');
});
