import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';
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
import {verifyPage} from "../../../../support/common/verifyPage";
import {getLocalPlanningDepart} from "../../../../support/eligibility/page-objects/local-planning-department-po";
import {
  getPlanningApplicationType
} from "../../../../support/eligibility/planning-application-type/get-planning-application-type";
import {getSiteOption} from "../../../../support/eligibility/appellant-selects-the-site/get-site-option";
import {
  getPlanningApplicationDecision
} from "../../../../support/eligibility/granted-or-refused-application/get-planning-application-decision";
import {
  getDateDecisionReceived
} from "../../../../support/eligibility/date-decision-received/get-date-decision-received";
import {getDateDecisionDue} from "../../../../support/eligibility/date-decision-due/get-date-decision-due";
import {getBackLink} from "../../../../support/common-page-objects/common-po";
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
import {
  getDateHouseholderDecisionReceived
} from "../../../../support/eligibility/date-decision-received/get-date-householder-decision-received";
import {
  getDateDecisionDueHouseholder
} from "../../../../support/eligibility/date-decision-due-householder/get-date-decision-due-householder";
const url = 'before-you-start/local-planning-depart';
let validDate;
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

Given('appellant selects {string} from the list of options',(option)=>{
  verifyPageTitle('Was your planning application about any of the following? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Was your planning application about any of the following?');
  selectSiteOption(option);
});
Given('appellant selects the {string}',(application_decision)=>{
  verifyPageTitle('Was your planning application granted or refused? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Was your planning application granted or refused?');
  selectPlanningApplicationDecision(application_decision);
});

Given('appellant enters the date within 6 months when the {string} was received',(application_decision)=>{
validDate = getPastDate(allowedDatePart.MONTH, 3);
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

Given('appellant selects the option as No for listed building',()=>{
  verifyPageTitle('Is your appeal about a listed building? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Is your appeal about a listed building?');
  selectListedBuildingDecision('No');
});

When('appellant clicks on back link',()=>{
  getBackLink().click();
});

Given('appellant enters the date within 12 weeks when the {string} was received',(application_decision)=>{
  validDate = getPastDate(allowedDatePart.WEEK, 8);
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
Given('data is persisted for the date when the {string} was received',(application_decision)=>{
    if(application_decision==='Granted' || application_decision === 'Refused'){
      verifyPageTitle('What\'s the decision date on the letter from the local planning department? - Before you start - Appeal a planning decision - GOV.UK');
      verifyPageHeading('What\'s the decision date on the letter from the local planning department?');
      getDateDecisionReceived( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
    }
  else{
      verifyPageTitle('What date was your decision due? - Before you start - Appeal a planning decision - GOV.UK');
      verifyPageHeading('What date was your decision due?');
      getDateDecisionDue( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
    }

});

Given('appellant selects No from the claiming costs option',()=>{
  verifyPageTitle('Are you claiming costs as part of your appeal? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Are you claiming costs as part of your appeal?');
  getClaimingCostNo().check();
});

When('appellant enters the date within 12 weeks when the Refused decision was received',()=>{
  validDate = getPastDate(allowedDatePart.WEEK, 8);
  verifyPageTitle('What\'s the decision date on the letter from the local planning department? - Before you start - Appeal a householder planning decision - GOV.UK');
  verifyPageHeading('What\'s the decision date on the letter from the local planning department?');
  enterDateHouseholderDecisionReceived( {day: getDate(validDate), month: getMonth(validDate) + 1, year: getYear(validDate) } );
});

Then('appellant is navigated to householder appeal task list page',()=>{
  verifyPage('appellant-submission/task-list');
});

Then('data is persisted for local planning department',()=>{
  verifyPageTitle('Which local planning department dealt with your planning application? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Which local planning department dealt with your planning application?');
  getLocalPlanningDepart().get('option:selected').should('have.text','System Test Borough Council');
})

Then('appellant is navigated to full appeal task list page',()=>{
verifyPage('full-appeal/submit-appeal/task-list');
});

Then('data is persisted for {string} planning application type',(applicationType)=>{
  verifyPageTitle('What type of planning application is your appeal about? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('What type of planning application is your appeal about?');
  getPlanningApplicationType(applicationType);
});

Then('data is persisted for {string} from the list of options',(option)=>{
  verifyPageTitle('Was your planning application about any of the following? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Was your planning application about any of the following?');
getSiteOption(option);
});

Then('data is persisted for {string}',(application_decision)=>{
  verifyPageTitle('Was your planning application granted or refused? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Was your planning application granted or refused?');
getPlanningApplicationDecision(application_decision);
});

Then('data is persisted for enforcement notice',()=>{
  verifyPageTitle('Have you received an enforcement notice? - Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Have you received an enforcement notice?');
  getEnforcementNoticeNo().should('be.checked');
});

Then('appellant clicks on browser back',()=>{
  cy.go('back');
})
