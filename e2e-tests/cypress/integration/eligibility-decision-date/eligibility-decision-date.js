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

Given('a Decision Date is requested', () => {
  cy.goToDecisionDatePage();
});

When('an eligible Decision Date is provided', () => {
  const aGoodDate = dateForXDaysAgo(84);
  cy.provideDecisionDate(aGoodDate);
});

When('an ineligible Decision Date is provided', () => {
  const aBadDate = dateForXDaysAgo(85);
  cy.provideDecisionDate(aBadDate);
});

When('absence of Decision Date is confirmed', () => {
  cy.accessConfirmHavingNoDecisionDate();
});

When('an invalid Decision Date of {string}-{string}-{string} is provided', (day, month, year) => {
  cy.provideDecisionDate({ day, month, year });
});

Then('progress is made to the Local Planning Department eligibility question', () => {
  cy.confirmNavigationLocalPlanningDepartmentPage();
});

Then('progress is halted with a message that the Decision Date is ineligible because it is beyond the deadline for an appeal', () => {
  cy.confirmNavigationDecisionDateExpiredPage();
});

Then('progress is halted with a message that a Decision Date is required', () => {
  cy.confirmNavigationDecisionDateAbsentPage();
});

Then('progress is halted with a message that the provided Decision Date is invalid', () => {
  cy.confirmProvidedDecisionDateWasInvalid();
});
