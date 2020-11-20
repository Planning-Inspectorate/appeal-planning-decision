import moment from "moment";
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

const dateForXDaysAgo = (x) => {
  const now = moment();
  const then = now.subtract(x, 'days');

  return {
    day: then.format('DD'),
    month: then.format('MM'),
    year: then.format('YYYY'),
  };
}

When('I provide a decision date that is less than 12 weeks old', () => {
  const aGoodDate = dateForXDaysAgo(84);
  cy.provideDecisionDate(aGoodDate);
});

Then('I can proceed with the provided decision date', () => {
  cy.confirmProvidedDecisionDateWasAccepted();
});

When('I provide a decision date that is more than 12 weeks old', () => {
  const aBadDate = dateForXDaysAgo(85);
  cy.provideDecisionDate(aBadDate);
});

Then('I am informed that the provided decision date is beyond the deadline for appeal', () => {
  cy.confirmProvidedDecisionDateWasRejected();
});

When('I provide a decision date of {string} / {string} / {string}', (day, month, year) => {
 cy.provideDecisionDate({day, month, year});
});

Then('I am informed that the provided Decision Date is invalid', () => {
  cy.confirmProvidedDecisionDateWasInvalid();
});
