import {Given, When,Then} from 'cypress-cucumber-preprocessor/steps';

import { selectPlanningApplicationDecision } from '../../../../support/eligibility/granted-or-refused-application/select-planning-application-decision';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import {
  getGrantedRadio,
  getPlanningApplicationDecisionError,
} from '../../../../support/eligibility/page-objects/granted-or-refused-application-po';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import {
  getBackLink,
  getErrorMessageSummary,
} from '../../../../support/common-page-objects/common-po';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import { getIsNotListedBuilding } from '../../../../support/eligibility/page-objects/listed-building-po';

const pageTitle = 'Was your planning application granted or refused? - Before you start - Appeal a planning decision - GOV.UK';
const pageHeading = 'Was your planning application granted or refused?';
const url = 'before-you-start/granted-or-refused-householder';
const decisionDatePageUrl = '/before-you-start/decision-date-householder';
const decisionDateDuePageUrl = '/before-you-start/date-decision-due-householder';
const previousPageUrl = '/before-you-start/listed-building-householder';

Given('appellant is on the was your planning application granted or refused householder page', () => {
    goToAppealsPage('before-you-start/local-planning-depart');
    getLocalPlanningDepart().select('System Test Borough Council');
    getContinueButton().click();
    selectPlanningApplicationType('Householder');
    getContinueButton().click();
    getIsNotListedBuilding().click();
    getContinueButton().click();
    cy.url().should('contain', url);
    acceptCookiesBanner();
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
});

When('appellant selects the granted or refused householder option as {string}', (decision) => {
    selectPlanningApplicationDecision(decision);
});

When('appellant clicks on the continue button',()=>{
  getContinueButton().click();
});

When('appellant clicks the back link',()=>{
  getBackLink().click();
});

Then('appellant gets navigated to the What’s the decision date on the letter from the local planning department?', () => {
  cy.url().should('contain', decisionDatePageUrl);
});

Then('appellant gets navigated to the decision due page', () => {
  cy.url().should('contain', decisionDateDuePageUrl);
});

Then('appellant sees an error message {string}',(errorMessage)=>{
  verifyErrorMessage(errorMessage, getPlanningApplicationDecisionError, getErrorMessageSummary);
});

Then('appellant is navigated to Is your appeal about a listed building?', () => {
  cy.url().should('contain',previousPageUrl);
});

Then('any information they have inputted will not be saved', () => {
  cy.url().should('contain',previousPageUrl);
  getIsNotListedBuilding().click();
  getContinueButton().click();
  getGrantedRadio().should('not.be.checked');
});
