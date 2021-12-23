import moment from 'moment';
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { provideDecisionDate } from '../../../../support/householder-planning/appeals-service/eligibility-decision-date/provideDecisionDate';
import { confirmNavigationLocalPlanningDepartmentPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationLocalPlanningDepartmentPage';
import { confirmDecisionDate } from '../../../../support/householder-planning/appeals-service/eligibility-decision-date/confirmDecisionDate';
import { confirmNavigationDecisionDateExpiredPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDateExpiredPage';
import { clickReEnterTheDecisionDate } from '../../../../support/householder-planning/appeals-service/eligibility-decision-date-passed/clickReEnterTheDecisionDate';
import { confirmNavigationDecisionDatePage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDatePage';
import { confirmProvidedDecisionDateError } from '../../../../support/householder-planning/appeals-service/eligibility-decision-date/confirmProvidedDecisionDateError';
import { confirmProvidedDecisionDateErrorHighlight } from '../../../../support/householder-planning/appeals-service/eligibility-decision-date/confirmProvidedDecisionDateErrorHighlight';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

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
  goToAppealsPage(pageURLAppeal.goToDecisionDatePage);
});

When('an eligible Decision Date is provided', () => {
  provideDecisionDate(eligibleDate);
});

When('an ineligible Decision Date is provided', () => {
  provideDecisionDate(ineligibleDate);
});

When('a Decision Date of {string}-{string}-{string} is provided', (day, month, year) => {
  provideDecisionDate({ day, month, year });
});

Then('progress is made to the Local Planning Department eligibility question', () => {
  confirmNavigationLocalPlanningDepartmentPage();
  confirmDecisionDate(eligibleDate);
});

Then(
  'progress is halted with a message that the Decision Date is ineligible because it is beyond the deadline for an appeal',
  () => {
    confirmNavigationDecisionDateExpiredPage();
  },
);

Then('the re-enter the decision date link is clicked', () => {
  clickReEnterTheDecisionDate();
});

Then('progress is made to the Decision Date question', () => {
  confirmNavigationDecisionDatePage();
  confirmDecisionDate(ineligibleDate);
});

Then('navigate to the Householder Planning Permission question', () => {
  //goToHouseholderQuestionPage();
  goToAppealsPage(pageURLAppeal.goToHouseholderQuestionPage);
});

Then('progress is halted with an error: {string}', (error) => {
  confirmProvidedDecisionDateError(error);
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
});

Then('the correct input {string} is highlighted', (highlights) => {
  confirmProvidedDecisionDateErrorHighlight(highlights);
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
});
