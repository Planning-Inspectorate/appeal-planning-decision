import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import {
  selectPlanningApplicationType
} from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import { selectNo, selectYes } from '../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { selectSiteOption } from '../../../../support/eligibility/appellant-selects-the-site/select-site-option';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import {
  selectPlanningApplicationDecision
} from '../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision';
import { allowedDatePart, getPastDate } from '../../../../support/common/getDate';
import {
  enterDateHouseholderDecisionReceived
} from '../../../../support/eligibility/date-decision-received/enter-date-householder-decision-received';
import { getDate, getMonth, getYear } from 'date-fns';
import {
  enterDateDecisionReceived
} from '../../../../support/eligibility/date-decision-received/enter-date-decision-received';
import { enterDateDecisionDue } from '../../../../support/eligibility/date-decision-due/enter-date-decision-due';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import {
  getPriorApprovalExistingHomeError, getPriorApprovalPlanningRadio,
} from '../../../../support/eligibility/page-objects/planning-application-type-po';
import {
  selectListedBuildingDecision
} from '../../../../support/eligibility/listed-building/select-listed-building-decision';

const pageHeading = 'Did you apply for prior approval to extend an existing home?';
const url = '/before-you-start/prior-approval-existing-home';
const pageTitle = 'Did you apply for prior approval to extend an existing home? - Before you start - Appeal a planning decision - GOV.UK';

Given('an appellant is on the is your appeal about any of the following page',()=>{
  goToAppealsPage('before-you-start/local-planning-depart');
  acceptCookiesBanner();
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
});

Given('the appellant is on the Did you apply for prior approval to extend an existing home page',()=>{
  goToAppealsPage('before-you-start/local-planning-depart');
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType('Prior approval');
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  cy.checkPageA11y();
})
When('appellant selects {string} and clicks continue', (application_type) =>{
  selectPlanningApplicationType(application_type);
  getSaveAndContinueButton().click();
});

Then('appellant is presented with the next page Did you apply for prior approval to extend an existing home?',()=>{
  cy.url().should('contain', url);
  verifyPageHeading(pageHeading);
 // verifyPageTitle(pageTitle);
});

When('appellant selects {string} and click continue',(approval_answer)=>{
  if(approval_answer==='yes'){
    selectYes().click();
  }else if(approval_answer==='no'){
    selectNo().click();
  }
  getSaveAndContinueButton().click();
});

When('appellant clicks on the continue button',()=>{
  getSaveAndContinueButton().click();
});

Then('appellant is presented with the next page Is your appeal about a listed building',()=>{
  cy.url().should('contain','before-you-start/listed-building-householder');
});

Given('appellant selects the option as No for listed building',()=>{
  cy.url().should('contain','before-you-start/listed-building-householder');
  selectListedBuildingDecision('No');
  getContinueButton().click();
})
Given('appellant is on the was your planning application granted or refused page for householder', () => {
  cy.url().should('contain', 'before-you-start/granted-or-refused-householder');
});

When('the appellant selects the option as {string}', (decision)=>{
  selectPlanningApplicationDecision(decision);
  getContinueButton().click();
});

Then('appellant is navigated to Appeal a householder planning decision',()=>{
  cy.url().should('contain','before-you-start/decision-date-householder');
  const validDate = getPastDate(allowedDatePart.WEEK, 7);
  enterDateHouseholderDecisionReceived( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
  getSaveAndContinueButton().click();
  cy.url().should('contain','before-you-start/enforcement-notice-householder');
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain','before-you-start/claiming-costs-householder');
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain','appellant-submission/task-list');
});

Then('appellant is navigated to Appeal a planning decision for {string}',(decision)=>{
  if(decision === 'Granted' ||  decision === 'Refused'){
    cy.url().should('contain','before-you-start/decision-date');
    const validDate = getPastDate(allowedDatePart.MONTH, 3);
    enterDateDecisionReceived( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
    getSaveAndContinueButton().click();
  }else if(decision === 'I have not received a decision'){
    cy.url().should('contain','before-you-start/date-decision-due');
    const validDate = getPastDate(allowedDatePart.MONTH, 3);
    enterDateDecisionDue( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
    getSaveAndContinueButton().click();
  }
  cy.url().should('contain','before-you-start/enforcement-notice');
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain','full-appeal/submit-appeal/task-list');
});

Then('appellant is presented with the next page Was your planning application about any of the following',()=>{
  cy.url().should('contain','before-you-start/any-of-following');
  selectSiteOption('None of these');
  getSaveAndContinueButton().click();
})

Then('appellant is on the was your planning application granted or refused page',()=>{
  cy.url().should('contain','before-you-start/granted-or-refused');
});

Then('appellant sees an error message {string}',(error_message)=>{
  verifyErrorMessage(error_message,getPriorApprovalExistingHomeError,getErrorMessageSummary);
});
When('appellant clicks on back link',()=>{
  getBackLink().click();
});

Then('appellant is presented with the What type of planning application if your appeal about page',()=>{
  cy.url().should('contain','before-you-start/type-of-planning-application');
  getPriorApprovalPlanningRadio().should('be.checked');
})
