import {Given,When, Then} from 'cypress-cucumber-preprocessor/steps';
import {goToAppealsPage} from "../../../../support/common/go-to-page/goToAppealsPage";
import {verifyPageTitle} from "../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../support/common/verify-page-heading";
import {
  getClaimingCostNo,
  getClaimingCostsErrorMessage,
  getClaimingCostYes
} from "../../../../support/eligibility/page-objects/claiming-costs-po";
import {getContinueButton} from "../../../../support/householder-planning/appeals-service/page-objects/common-po";
import {verifyPage} from "../../../../support/common/verifyPage";
import {verifyErrorMessage} from "../../../../support/common/verify-error-message";
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import { selectSiteOption } from '../../../../support/eligibility/appellant-selects-the-site/select-site-option';
import { selectPlanningApplicationDecision } from '../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision';
import { allowedDatePart, getPastDate } from '../../../../support/common/getDate';
import { enterDateDecisionDue } from '../../../../support/eligibility/date-decision-due/enter-date-decision-due';
import { getDate, getMonth, getYear } from 'date-fns';
import { getEnforcementNoticeNo } from '../../../../support/eligibility/page-objects/enforcement-notice-po';
import { getListedBuildingOption } from '../../../../support/eligibility/page-objects/appellant-selects-the-site-po';
import { getIsNotListedBuilding } from '../../../../support/eligibility/page-objects/listed-building-po';
import { enterDateDecisionDueHouseholder } from '../../../../support/eligibility/date-decision-due-householder/enter-date-decision-due-householder';
const pageUrl = 'before-you-start/claiming-costs-householder';
const pageTitle = 'Are you claiming costs as part of your appeal? - Before you start - Appeal a planning decision - GOV.UK';
const pageHeading = 'Are you claiming costs as part of your appeal?';

Given('appellant is on the claiming cost page',()=>{
  goToAppealsPage('before-you-start/local-planning-depart');
  getLocalPlanningDepart().select('System Test Borough Council');
  getContinueButton().click();
  selectPlanningApplicationType('Householder');
  getContinueButton().click();
  getIsNotListedBuilding().click();
  getContinueButton().click();
  selectPlanningApplicationDecision('Refused');
  getContinueButton().click();
  const validDate = getPastDate(allowedDatePart.MONTH, 3);
  enterDateDecisionDueHouseholder({ day: getDate(validDate), month: getMonth(validDate) +2, year: getYear(validDate)});
  getContinueButton().click();
  getEnforcementNoticeNo().click();
  getContinueButton().click();
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});

When('appellant selects {string} from the options',(claimingCost)=>{
  if(claimingCost === 'No'){
    getClaimingCostNo().check();
  }else{
    getClaimingCostYes().check();
  }
});

When('appellant clicks on the continue button',()=>{
  getContinueButton().click();
});

When('appellant clicks the back button',()=>{
  getBackLink().click();
});

Then('appellant gets navigated to HAS Appeal form',()=>{
  verifyPage('/results');
});

Then('appellant gets navigated to HAS task list',()=>{
  verifyPage('/task-list');
});

Then('appellants gets routed to shutter page which notifies them to use a different service',()=>{
  cy.url().should('contain', '/before-you-start/use-a-different-service');
});

Then('appellant sees an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getClaimingCostsErrorMessage, getErrorMessageSummary);
});

Then('appellant is navigated to the enforcement notice page',()=>{
  verifyPage('before-you-start/enforcement-notice-householder');
});

Then('information they have inputted will not be saved',()=>{
  verifyPage('before-you-start/enforcement-notice-householder');
  getContinueButton().click();
  getClaimingCostYes().should('not.be.checked');
})

