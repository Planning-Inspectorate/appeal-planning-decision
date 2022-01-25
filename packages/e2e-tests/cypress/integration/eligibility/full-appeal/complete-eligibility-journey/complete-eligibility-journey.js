import {Given, Then} from 'cypress-cucumber-preprocessor/steps';
import {goToAppealsPage} from "../../../../support/common/go-to-page/goToAppealsPage";
import {acceptCookiesBanner} from "../../../../support/common/accept-cookies-banner";
import {verifyPageTitle} from "../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../support/common/verify-page-heading";
import {
  enterLocalPlanningDepart
} from "../../../../support/eligibility/local-planning-depart/enter-local-planning-depart";
import {getContinueButton} from "../../../../support/householder-planning/appeals-service/page-objects/common-po";
import {
  selectPlanningApplicationType
} from "../../../../support/eligibility/planning-application-type/select-planning-application-type";
import {selectSiteOption} from "../../../../support/eligibility/appellant-selects-the-site/select-site-option";
import {
  selectPlanningApplicationDecision
} from "../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision";
import {clickContinueButton} from "../../../../support/common/clickContinueButton";
import {allowedDatePart, getPastDate} from "../../../../support/common/getDate";
import {
  enterDateDecisionReceived
} from "../../../../support/eligibility/date-decision-received/enter-date-decision-received";
import {getDate, getMonth, getYear} from "date-fns";
import {enterDateDecisionDue} from "../../../../support/eligibility/date-decision-due/enter-date-decision-due";
import {getEnforcementNoticeNo} from "../../../../support/eligibility/page-objects/enforcement-notice-po";
const url = 'before-you-start/local-planning-depart';
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

Given('appellant selects {string} from the list of options',(option)=>{
  verifyPageTitle('Was your planning application about any of the following? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Was your planning application was about any of the following?');
  selectSiteOption(option);
});
Given('appellant selects the {string}',(application_decision)=>{
  verifyPageTitle('Was your planning application granted or refused? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Was your planning application granted or refused?');
  selectPlanningApplicationDecision(application_decision);
});

Given('appellant enters the date within 6 months when the {string} was received',(application_decision)=>{
  const validDate = getPastDate(allowedDatePart.MONTH, 3);
  if(application_decision==='Granted' || application_decision ==='Refused'){
    verifyPageTitle('What\'s the decision date on the letter from the local planning department? - Before you start - Appeal a planning decision - GOV.UK');
    verifyPageHeading('What\'s the decision date on the letter from the local planning department?');
    enterDateDecisionReceived( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
  }else{
    verifyPageTitle('What date was your decision due? - Before you start - Appeal a planning decision - GOV.UK');
    verifyPageHeading('What date was your decision due?');
    enterDateDecisionDue( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
  }
});

Given('appellant selects No from the enforcement notice options',()=>{
  verifyPageTitle('Have you received an enforcement notice? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Have you received an enforcement notice?');
  getEnforcementNoticeNo().check();
});

Then('appellant is navigated to full appeal task list page',()=>{

});

