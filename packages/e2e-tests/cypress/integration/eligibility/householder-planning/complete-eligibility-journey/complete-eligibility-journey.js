import {Given, Then} from 'cypress-cucumber-preprocessor/steps';
import {goToAppealsPage} from "../../../../support/common/go-to-page/goToAppealsPage";
import {acceptCookiesBanner} from "../../../../support/common/accept-cookies-banner";
import {verifyPageTitle} from "../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../support/common/verify-page-heading";
import {
  enterLocalPlanningDepart
} from "../../../../support/eligibility/local-planning-depart/enter-local-planning-depart";
import {
  selectPlanningApplicationType
} from "../../../../support/eligibility/planning-application-type/select-planning-application-type";
import {
  selectPlanningApplicationDecision
} from "../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision";
import {clickContinueButton} from "../../../../support/common/clickContinueButton";
import {allowedDatePart, getPastDate} from "../../../../support/common/getDate";
import {getDate, getMonth, getYear} from "date-fns";
import {getEnforcementNoticeNo} from "../../../../support/eligibility/page-objects/enforcement-notice-po";
import {verifyPage} from "../../../../support/common/verifyPage";
import {
  selectListedBuildingDecision
} from "../../../../support/eligibility/listed-building/select-listed-building-decision";
import {
  enterDateHouseholderDecisionReceived
} from "../../../../support/eligibility/date-decision-received/enter-date-householder-decision-received";
import {
  enterDateDecisionDueHouseholder
} from "../../../../support/eligibility/date-decision-due-householder/enter-date-decision-due-householder";
import {getClaimingCostNo} from "../../../../support/eligibility/page-objects/claiming-costs-po";
const url = 'before-you-start/local-planning-depart';
before(()=>{
  cy.task('getData',{collection:'appeals',filter:"appeal.state"});
});
Given('appellant selects local planning department',()=>{
  goToAppealsPage(url);
  acceptCookiesBanner();
  verifyPageTitle('Which local planning department dealt with your planning application? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Which local planning department dealt with your planning application?');
  enterLocalPlanningDepart('System Test Borough Council');
});

Given('appellant clicks on the continue button',()=>{
  clickContinueButton();
});

Given('appellant selects {string} planning application type',(applicationType)=>{
  verifyPageTitle('What type of planning application is your appeal about? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('What type of planning application is your appeal about?');
  selectPlanningApplicationType(applicationType);
});

Given('appellant selects the option as No for listed building',()=>{
  verifyPageTitle('Is your appeal about a listed building? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Is your appeal about a listed building?');
  selectListedBuildingDecision('No');
});
Given('appellant selects the {string}',(application_decision)=>{
  verifyPageTitle('Was your planning application granted or refused? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPage('/before-you-start/granted-or-refused-householder');
  verifyPageHeading('Was your planning application granted or refused?');
  selectPlanningApplicationDecision(application_decision);
});

Given('appellant enters the date within {string} when the {string} was received',(deadline_duration, application_decision)=>{
  if(deadline_duration==='6 months' && application_decision==='Granted'){
   const validDate = getPastDate(allowedDatePart.MONTH, 3);
      verifyPageTitle('What\'s the decision date on the letter from the local planning department? - Before you start - Appeal a householder planning decision - GOV.UK');
      verifyPageHeading('What\'s the decision date on the letter from the local planning department?');
      enterDateHouseholderDecisionReceived( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
    }
  else if(deadline_duration==='12 weeks' && application_decision==='Refused') {
    const validDate = getPastDate(allowedDatePart.WEEK, 8);
    verifyPageTitle('What\'s the decision date on the letter from the local planning department? - Before you start - Appeal a householder planning decision - GOV.UK');
    verifyPageHeading('What\'s the decision date on the letter from the local planning department?');
    enterDateHouseholderDecisionReceived( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
  }
  else{
      const validDate = getPastDate(allowedDatePart.MONTH, 3);
      verifyPageTitle('What date was your decision due? - Before you start - Appeal a householder planning decision - GOV.UK');
      verifyPageHeading('What date was your decision due?');
      enterDateDecisionDueHouseholder( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
    }
  });

Given('appellant selects No from the enforcement notice options',()=>{
  verifyPageTitle('Have you received an enforcement notice? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Have you received an enforcement notice?');
  getEnforcementNoticeNo().check();
});
Given('appellant selects No from the claiming costs option',()=>{
  verifyPageTitle('Are you claiming costs as part of your appeal? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Are you claiming costs as part of your appeal?');
  getClaimingCostNo().check();
})

Then('appellant is navigated to householder appeal task list page',()=>{
  verifyPage('appellant-submission/task-list');
});

