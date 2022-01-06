import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import {
  getEnforcementNoticeErrorMessage,
  getEnforcementNoticeNo, getEnforcementNoticeYes,
} from '../../../../support/full-planning/eligibility/page-objects/enforcement-notice-po';
import { getContinueButton, getErrorMessageSummary } from '../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
const pageHeading = 'Have you received an enforcement notice?';
const pageTitle = 'Have you received an enforcement notice? - Before you start - Appeal a planning decision - GOV.UK';
const url = `before-you-start/enforcement-notice`;

Given('appellant is on the enforcement notice page', () => {
  goToAppealsPage(url, { headers: { 'Referer': `${Cypress.env('APPEALS_BASE_URL')}/before-you-start/decision-date` } });
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
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

Then('appellant gets navigated to the was your planning application claiming costs page', () => {
  cy.url().should('contain', '/before-you-start/claiming-costs');
});

Then('appellant is navigated to the shutter page', () => {
  cy.url().should('contain', '/before-you-start/use-a-different-service');
});

Then('appellant is navigated to the decision date page', () => {
  cy.url().should('contain', '/before-you-start/decision-date');
});

Then('appellant sees an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getEnforcementNoticeErrorMessage, getErrorMessageSummary);
})
Then('information they have inputted will not be saved', () => {
  goToAppealsPage(url);
  getEnforcementNoticeYes().should('not.be.checked');
})
