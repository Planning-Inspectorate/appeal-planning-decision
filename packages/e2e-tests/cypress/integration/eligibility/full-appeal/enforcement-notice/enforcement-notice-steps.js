import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import {
  getEnforcementNoticeErrorMessage,
  getEnforcementNoticeNo, getEnforcementNoticeYes,
} from '../../../../support/eligibility/page-objects/enforcement-notice-po';
import { getErrorMessageSummary, getSaveAndContinueButton } from '../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import { selectPlanningApplicationDecision } from '../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision';
import { allowedDatePart, getPastDate } from '../../../../support/common/getDate';
import { enterDateDecisionDue } from '../../../../support/eligibility/date-decision-due/enter-date-decision-due';
import { getDate, getMonth, getYear } from 'date-fns';
import { selectSiteOption } from '../../../../support/eligibility/appellant-selects-the-site/select-site-option';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
const pageHeading = 'Have you received an enforcement notice?';
const pageTitle = 'Have you received an enforcement notice? - Before you start - Appeal a planning decision - GOV.UK';
const url = `before-you-start/enforcement-notice`;
const typeOfPlanningPageUrl = `before-you-start/type-of-planning-application`;

Given('appellant is on the enforcement notice page', () => {
  goToAppealsPage('before-you-start/local-planning-depart');
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  cy.url().should('contain', typeOfPlanningPageUrl);
  selectPlanningApplicationType('Full planning');
  getContinueButton().click();
  selectSiteOption('None of these');
  getContinueButton().click();
  selectPlanningApplicationDecision('I have not received a decision');
  getContinueButton().click();
  const validDate = getPastDate(allowedDatePart.MONTH, 3);
  enterDateDecisionDue( {day: getDate(validDate), month: getMonth(validDate)+1, year: getYear(validDate) } );
  getContinueButton().click();
  cy.url().should('contain', url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

Given('appellant is on the enforcement notice page for {string}', (application_type) => {
  goToAppealsPage('before-you-start/local-planning-depart');
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  cy.url().should('contain', typeOfPlanningPageUrl);
  selectPlanningApplicationType(application_type);
  getContinueButton().click();
  selectSiteOption('None of these');
  getContinueButton().click();
  selectPlanningApplicationDecision('I have not received a decision');
  getContinueButton().click();
  const validDate = getPastDate(allowedDatePart.MONTH, 3);
  enterDateDecisionDue( {day: getDate(validDate), month: getMonth(validDate)+1, year: getYear(validDate) } );
  getContinueButton().click();
});

When('appellant selects {string} from the options', (enforcementOption) => {
  if (enforcementOption === 'No') {
    getEnforcementNoticeNo().click();
  } else {
    getEnforcementNoticeYes().check();
  }
});
When('appellant clicks on the continue button', () => {
  getContinueButton().click();
});

When('appellant selects the back button', () => {
  getBackLink().click();
});

Then('appellant gets navigated to appeal a planning decision task list page', () => {
  cy.url().should('contain', '/full-appeal/submit-appeal/task-list');
});

Then('appellant is navigated to the shutter page', () => {
  cy.url().should('contain', '/before-you-start/use-a-different-service');
});

Then('appellant is navigated to the date decision due page', () => {
  cy.url().should('contain', '/before-you-start/date-decision-due');
});

Then('appellant sees an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getEnforcementNoticeErrorMessage, getErrorMessageSummary);
})

Then('information they have inputted will not be saved', () => {
  cy.url().should('contain', '/before-you-start/date-decision-due');
  getContinueButton().click();
  getEnforcementNoticeYes().should('not.be.checked');
})
