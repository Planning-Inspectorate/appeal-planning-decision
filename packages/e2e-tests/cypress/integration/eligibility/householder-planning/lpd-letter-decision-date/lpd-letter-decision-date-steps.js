import { Given,When,Then } from 'cypress-cucumber-preprocessor/steps';
import {
  selectPlanningApplicationType
} from "../../../../support/eligibility/planning-application-type/select-planning-application-type";
import {goToAppealsPage} from "../../../../support/common/go-to-page/goToAppealsPage";
import {verifyPage} from "../../../../support/common/verifyPage";
import {
  selectPlanningApplicationDecision
} from "../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision";
import {verifyPageTitle} from "../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../support/common/verify-page-heading";
import {allowedDatePart, getFutureDate, getPastDate} from "../../../../support/common/getDate";
import {getDate, getMonth, getYear} from "date-fns";
import {
  enterDateDecisionReceived
} from "../../../../support/eligibility/date-decision-received/enter-date-decision-received";
import {getDateHouseholderDecisionReceivedDay} from "../../../../support/eligibility/page-objects/date-decision-received-po";
import {clickContinueButton} from "../../../../support/common/clickContinueButton";
import {verifyErrorMessage} from "../../../../support/common/verify-error-message";
import {getBackLink, getErrorMessageSummary} from "../../../../support/common-page-objects/common-po";
import {
  verifyHouseholderDecisionDatesHighlights
} from "../../../../support/eligibility/date-decision-received/enter-date-householder-decision-received";
import {getPlanningApplicationHouseholderDecisionError} from "../../../../support/eligibility/page-objects/date-decision-received-po";
import {
  selectListedBuildingDecision
} from '../../../../support/eligibility/listed-building/select-listed-building-decision';
import {
  enterDateHouseholderDecisionReceived
} from '../../../../support/eligibility/date-decision-received/enter-date-householder-decision-received';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
const pageHeading = 'What\'s the decision date on the letter from the local planning department?';
const pageTitle = 'What\'s the decision date on the letter from the local planning department? - Before you start - Appeal a householder planning decision - GOV.UK';
const url = `/decision-date-householder`;
const typeOfPlanningPageUrl = `before-you-start/type-of-planning-application`;
const enforcementNoticePageUrl = '/enforcement-notice';
const grantedOrRefusedPageUrl = '/granted-or-refused-householder';
const shutterPageUrl = '/you-cannot-appeal';

Given('appellant navigates to decision date received page for householder appeal',()=>{
  goToAppealsPage('before-you-start/local-planning-depart');
  getLocalPlanningDepart().select('System Test Borough Council');
  getContinueButton().click();
  selectPlanningApplicationType('Householder');
  verifyPage(typeOfPlanningPageUrl);
  clickContinueButton();
  selectListedBuildingDecision('No');
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
  cy.checkPageA11y();
});

When('appellant enters the date lesser than the deadline date for {string}',(application_decision)=>{
  if(application_decision==='Granted'){
    const validDate = getPastDate(allowedDatePart.MONTH, 3);
    enterDateHouseholderDecisionReceived( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
  }else if(application_decision==='Refused'){
    const validDate = getPastDate(allowedDatePart.MONTH, 2);
    enterDateHouseholderDecisionReceived( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
  }

});

When('appellant clicks on continue',()=>{
  clickContinueButton();
});

When('appellant enters future date decision received of {string}-{string}', (datePart, value) => {
  const futureDate = getFutureDate(datePart, value);
  enterDateHouseholderDecisionReceived( {day: ("0" + getDate(futureDate)).slice(-2), month: ("0" + (getMonth(futureDate)+1)).slice(-2) , year: getYear(futureDate) } );
});

When('appellant enters the date older than the deadline date for {string}',(application_decision)=>{
  if(application_decision==='Granted'){
    const pastDate = getPastDate(allowedDatePart.MONTH, 7);
    enterDateHouseholderDecisionReceived( {day: ("0" + getDate(pastDate)).slice(-2), month: ("0" + (getMonth(pastDate)+1)).slice(-2) , year: getYear(pastDate) } );
  }else if(application_decision==='Refused'){
    const pastDate = getPastDate(allowedDatePart.MONTH, 4);
    enterDateHouseholderDecisionReceived( {day: ("0" + getDate(pastDate)).slice(-2), month: ("0" + (getMonth(pastDate)+1)).slice(-2) , year: getYear(pastDate) } );
  }

});

When('appellant enters date decision received of {string}-{string}-{string}',(day,month,year)=>{
  enterDateHouseholderDecisionReceived({day,month,year});
});

When('appellant is navigated to the granted or refused page for {string}',(application_decision)=>{
  cy.url().should('contain', grantedOrRefusedPageUrl);
  selectPlanningApplicationDecision(application_decision);
  clickContinueButton();
});

When('appellant clicks the back button',()=>{
  getBackLink().click();
})

Then('decision received date they have inputted will not be saved',()=>{
  getDateHouseholderDecisionReceivedDay().should('have.text', '');
});

Then('appellant is navigated to the have you received an enforcement notice page',()=>{
  cy.url().should('contain', enforcementNoticePageUrl);
});

Then('appellant gets routed to a page which notifies them that the decision appeal date has passed',()=>{
  cy.url().should('contain', shutterPageUrl);
});

Then('progress is halted with an error: {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getPlanningApplicationHouseholderDecisionError, getErrorMessageSummary);
});

Then('the correct input {string} is highlighted', (highlights) => {
  verifyHouseholderDecisionDatesHighlights(highlights);
});
