import moment from 'moment';
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const dateForXDaysAgo = (x) => {
  const now = moment();
  const then = now.subtract(x, 'days');

  return {
    day: then.format('DD'),
    month: then.format('MM'),
    year: then.format('YYYY'),
  };
};

const eligibleDate = dateForXDaysAgo(84);
const ineligibleDate = dateForXDaysAgo(85);

Given('a Decision Date is requested', () => {
  cy.goToDecisionDatePage();
});

When('an eligible Decision Date is provided', () => {
  cy.provideDecisionDate(eligibleDate);
});

When('an ineligible Decision Date is provided', () => {
  cy.provideDecisionDate(ineligibleDate);
});

When('absence of Decision Date is confirmed', () => {
  cy.accessConfirmHavingNoDecisionDate();
});

When('an invalid Decision Date of {string}-{string}-{string} is provided', (day, month, year) => {
  cy.provideDecisionDate({ day, month, year });
});

Then('progress is made to the Local Planning Department eligibility question', () => {
  cy.confirmNavigationLocalPlanningDepartmentPage();
  cy.confirmDecisionDate(eligibleDate);
});

Then(
  'progress is halted with a message that the Decision Date is ineligible because it is beyond the deadline for an appeal',
  () => {
    cy.confirmNavigationDecisionDateExpiredPage();
    cy.confirmDecisionDate(ineligibleDate);
  },
);

Then('progress is halted with a message that a Decision Date is required', () => {
  cy.confirmNavigationDecisionDateAbsentPage();
  cy.confirmDecisionDate({ day: '', month: '', year: '' });
});

Then('progress is halted with a message that the provided Decision Date is invalid', () => {
  cy.confirmProvidedDecisionDateWasInvalid();
  cy.confirmDecisionDate({ day: '', month: '', year: '' });
});
