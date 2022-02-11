import {Given, Then} from 'cypress-cucumber-preprocessor/steps';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import {
  selectPlanningApplicationType
} from "../../../../support/eligibility/planning-application-type/select-planning-application-type";
import {goToAppealsPage} from "../../../../support/common/go-to-page/goToAppealsPage";
import {verifyPage} from "../../../../support/common/verifyPage";
import {selectSiteOption} from "../../../../support/eligibility/appellant-selects-the-site/select-site-option";
import {
  selectPlanningApplicationDecision
} from "../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision";
import {allowedDatePart, getPastDate} from "../../../../support/common/getDate";
import {getDate, getMonth, getYear} from "date-fns";
import {
  enterDateDecisionReceived
} from "../../../../support/eligibility/date-decision-received/enter-date-decision-received";
import {clickContinueButton} from "../../../../support/common/clickContinueButton";
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { getSaveAndContinueButton } from '../../../../support/common-page-objects/common-po';

const pageHeading = 'You cannot appeal.';
const pageTitle = 'You cannot appeal - Before you start - Appeal a planning decision - GOV.UK';
const typeOfPlanningPageUrl = `before-you-start/type-of-planning-application`;

Given('an appellant is on the shutter page for date passed for appeal',()=>{
  goToAppealsPage('before-you-start/local-planning-depart');
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType('Full planning');
  verifyPage(typeOfPlanningPageUrl);
  clickContinueButton();
  selectSiteOption('None of these');
  clickContinueButton();
  selectPlanningApplicationDecision('I have not received a decision');
  clickContinueButton();
  const pastDate = getPastDate(allowedDatePart.MONTH, 7);
  enterDateDecisionReceived( {day: getDate(pastDate), month: getMonth(pastDate) + 1, year: getYear(pastDate) } );
  clickContinueButton();
});

Then('appellant is displayed details for  out of time shutter page',()=>{
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
})
