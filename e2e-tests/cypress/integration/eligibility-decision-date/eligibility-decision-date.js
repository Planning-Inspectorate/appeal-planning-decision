import moment from 'moment';
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

export const dateForXDaysAgo = (x) => {
  const now = moment();
  const then = now.subtract(x, 'days');

  return {
    day: then.format('DD'),
    month: then.format('MM'),
    year: then.format('YYYY'),
  };
};

export const eligibleDate = dateForXDaysAgo(5);
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

When('a Decision Date of {string}-{string}-{string} is provided', (day, month, year) => {
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
  },
);

Then('the re-enter the decision date link is clicked', () => {
  cy.clickReEnterTheDecisionDate();
});

Then('progress is made to the Decision Date question', () => {
  cy.confirmNavigationDecisionDatePage();
  cy.confirmDecisionDate(ineligibleDate);
});

Then('navigate to the Householder Planning Permission question', () => {
  cy.goToHouseholderQuestionPage();
});

Then('progress is halted with an error: {string}', (error) => {
  cy.confirmProvidedDecisionDateError(error);
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
});

Then('the correct input {string} is highlighted', (highlights) => {
  cy.confirmProvidedDecisionDateErrorHighlight(highlights);
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
});
