import { Given,When,Then } from 'cypress-cucumber-preprocessor/steps';
import {
  selectPlanningApplicationType
} from "../../../../support/eligibility/planning-application-type/select-planning-application-type";
import {goToAppealsPage} from "../../../../support/common/go-to-page/goToAppealsPage";
import {verifyPage} from "../../../../support/common/verifyPage";
import {selectSiteOption} from "../../../../support/eligibility/appellant-selects-the-site/select-site-option";
import {
  selectPlanningApplicationDecision
} from "../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision";
import {verifyPageTitle} from "../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../support/common/verify-page-heading";
import {allowedDatePart, getFutureDate, getPastDate} from "../../../../support/common/getDate";
import {getDate, getMonth, getYear, format, addMonths} from "date-fns";
import {
  enterDateDecisionReceived
} from "../../../../support/eligibility/date-decision-received/enter-date-decision-received";
import {
  getDateDecisionDueDay,
  getPlanningApplicationDecisionError
} from "../../../../support/eligibility/page-objects/date-decision-due-po";
import {getDateDecisionReceivedDay} from "../../../../support/eligibility/page-objects/date-decision-received-po";
import {getContinueButton} from "../../../../support/householder-planning/appeals-service/page-objects/common-po";
import {clickContinueButton} from "../../../../support/common/clickContinueButton";
import {verifyErrorMessage} from "../../../../support/common/verify-error-message";
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import {
  enterDateDecisionDue,
  verifyHighlights
} from "../../../../support/eligibility/date-decision-due/enter-date-decision-due";
import {getAppealDeadline} from "../../../../support/eligibility/page-objects/shutter-page-po";
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
const pageHeading = 'What\'s the decision date on the letter from the local planning department?';
const pageTitle = 'What\'s the decision date on the letter from the local planning department? - Before you start - Appeal a planning decision - GOV.UK';
const url = `/decision-date`;
const typeOfPlanningPageUrl = `before-you-start/type-of-planning-application`;
const enforcementNoticePageUrl = '/enforcement-notice';
const grantedOrRefusedPageUrl = '/granted-or-refused';
const shutterPageUrl = '/you-cannot-appeal';
let pastDate;

Given('appellant navigates to decision date received page for {string}',(application_type)=>{
  goToAppealsPage('before-you-start/local-planning-depart');
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType(application_type);
  verifyPage(typeOfPlanningPageUrl);
  clickContinueButton();
  selectSiteOption('None of these');
  clickContinueButton();
});

Given('appellant selects the {string}',(application_decision)=>{
  selectPlanningApplicationDecision(application_decision);
  clickContinueButton();
});

Given('appellant is on the what date was the decision received page',()=>{
  verifyPage(url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});

When('appellant enters the date within 6 months when the decision was received',()=>{
  const validDate = getPastDate(allowedDatePart.MONTH, 3);
  enterDateDecisionReceived( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
});

When('appellant clicks on continue',()=>{
  clickContinueButton();
});

When('appellant enters future date decision received of {string}-{string}', (datePart, value) => {
  const futureDate = getFutureDate(datePart, value);
  enterDateDecisionReceived( {day: getDate(futureDate), month: getMonth(futureDate) + 1, year: getYear(futureDate) } );
});

When('appellant enters the date older than 6 months when the decision was received',()=>{
  pastDate = getPastDate(allowedDatePart.MONTH, 7);
  enterDateDecisionReceived( {day: getDate(pastDate), month: getMonth(pastDate) + 1, year: getYear(pastDate) } );
});

When('appellant enters date decision received of {string}-{string}-{string}',(day,month,year)=>{
  enterDateDecisionReceived({day,month,year});
});

When('appellant is navigated to the granted or refused page for {string}',(application_decision)=>{
  cy.url().should('contain', grantedOrRefusedPageUrl);
  selectPlanningApplicationDecision(application_decision);
  clickContinueButton();
});

When('appellant selects the back button',()=>{
  getBackLink().click();
})

Then('decision received date they have inputted will not be saved',()=>{
  getDateDecisionReceivedDay().should('have.text', '');
});

Then('appellant is navigated to the have you received an enforcement notice page',()=>{
  cy.url().should('contain', enforcementNoticePageUrl);
});

Then('appellant gets routed to a page which notifies them that the decision appeal date has passed',()=>{
  cy.url().should('contain', shutterPageUrl);
  pastDate = format(addMonths(pastDate,6),'dd MMMM yyyy');
  getAppealDeadline().should('contain', '6 months');
  getAppealDeadline().should('contain',pastDate);
});

Then('progress is halted with an error: {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getPlanningApplicationDecisionError, getErrorMessageSummary);
});

Then('the correct input {string} is highlighted', (highlights) => {
  verifyHighlights(highlights);
});
