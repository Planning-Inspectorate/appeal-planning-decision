import { addDays, getDate, getMonth, getYear, endOfToday, startOfToday, subMonths, format } from 'date-fns';
import { Given,When,Then } from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { getContinueButton, getErrorMessageSummary } from '../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import {
  enterDateDecisionDue,
  verifyHighlights,
} from '../../../../support/full-appeal/eligibility/date-decision-due/enter-date-decision-due';
import { getPlanningApplicationDecisionError } from '../../../../support/full-appeal/eligibility/page-objects/date-decision-due-po';
const pageHeading = 'What date was the decision due?';
const pageTitle = 'What date was the decision due? - Before you start - Appeal a planning decision - GOV.UK';
const url = `${Cypress.env('APPEALS_BASE_URL')}/before-you-start/date-decision-due`;
const enforcementNoticePageUrl = '/before-you-start/enforcement-notice';
const shutterPageUrl = '/before-you-start/you-cannot-appeal';

Given('appellant is on the what date was the decision due page',()=>{
  goToPage(url);
  acceptCookiesBanner();
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

When('appellant enters the date within 6 months when they were due a decision', () => {
  const validDate = addDays(subMonths(endOfToday(), 5), 1);
  cy.log(format(validDate, 'PPpp'));
  enterDateDecisionDue('day', getDate(validDate));
  enterDateDecisionDue('month', getMonth(validDate));
  enterDateDecisionDue('year', getYear(validDate));
});

When('appellant enters a past date of over 6 months', () => {
  const validDate = addDays(subMonths(endOfToday(), 7), 1);
  cy.log(format(validDate, 'PPpp'));
  enterDateDecisionDue('day', getDate(validDate));
  enterDateDecisionDue('month', getMonth(validDate));
  enterDateDecisionDue('year', getYear(validDate));
});

When('appellant clicks on continue', () => {
  getContinueButton().click();
});

When('appellant enters date decision due of {string}-{string}-{string}', (day, month, year) => {
  if (day) enterDateDecisionDue('day', day);
  if (month) enterDateDecisionDue('month', month);
  if (year) enterDateDecisionDue('year', year);
});

Then('they are navigated to the have you received an enforcement notice page', () => {
  cy.url().should('contain', enforcementNoticePageUrl);
});

Then('appellant gets routed to a page which notifies them that they cannot appeal', () => {
  cy.url().should('contain', shutterPageUrl);
});

Then('progress is halted with an error: {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getPlanningApplicationDecisionError, getErrorMessageSummary);
});

Then('the correct input {string} is highlighted', (highlights) => {
  verifyHighlights(highlights);
});
