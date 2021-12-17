import {Given, When,Then} from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { verifyPageTitle } from '../../../../../../../e2e-tests/cypress/support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../../../e2e-tests/cypress/support/common/verify-page-heading';

import { selectPlanningApplicationDecision } from '../../../../support/full-planning/before-you-start/granted-or-refused-application/select-planning-application-decision';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import { getBackLink, getContinueButton, getErrorMessageSummary } from '../../../../../../../e2e-tests/cypress/support/page-objects/common-po';
import { getPlanningApplicationDecisionError } from '../../../../support/full-planning/before-you-start/page-objects/granted-or-refused-application-po';

const pageTitle = 'Was your planning application granted or refused? - Before you start - Appeal a planning decision - GOV.UK';
const pageHeading = 'Was your planning application granted or refused?';
const url = '/before-you-start/granted-or-refused';
const decisionDatePageUrl = '/before-you-start/decision-date';
const decisionDateDuePageUrl = '/before-you-start/decision-date-due';
const previousPageUrl = '/before-you-start/any-of-following';

Given('appellant is on the was your planning application granted or refused page', () => {
    goToPage(url);
    acceptCookiesBanner();
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
});

When('the appellant selects the option as {string}', (decision) => {
    selectPlanningApplicationDecision(decision);
});

When('appellant clicks on the continue button',()=>{
  getContinueButton().click();
});

When('an appellant selects the back button',()=>{
  getBackLink().click();
});
Then('appellant gets navigated to the What’s the decision date on the letter from the local planning department?', () => {
  cy.url().should('contain', decisionDatePageUrl);
});

Then('the appellant gets navigated to the decision due page', () => {
  cy.url().should('contain', decisionDateDuePageUrl);
});

Then('the appellant sees an error message {string}',(errorMessage)=>{
  verifyErrorMessage(errorMessage, getPlanningApplicationDecisionError, getErrorMessageSummary);
});

When('the appellant clicks the back button', () => {
  getBackLink().click();
});

Then('the appellant is navigated to Was your planning application about any of the following?', () => {
  cy.url().should('contain',previousPageUrl);
});
