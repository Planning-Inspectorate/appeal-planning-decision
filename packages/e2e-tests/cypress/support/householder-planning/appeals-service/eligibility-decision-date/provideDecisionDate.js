// implementation of the users desire to provide a decision date..
import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';

export const provideDecisionDate = ({ day, month, year }) => {

  // provide the date
  cy.get('#decision-date-day').type(`{selectall}{backspace}${day}`);
  cy.get('#decision-date-month').type(`{selectall}{backspace}${month}`);
  cy.get('#decision-date-year').type(`{selectall}{backspace}${year}`);

  clickSaveAndContinue();
  //cy.wait(Cypress.env('demoDelay'));
};
