import {
  getDateDecisionDueDay,
  getDateDecisionDueMonth,
  getDateDecisionDueYear
} from '../page-objects/date-decision-due-po';

export const enterDateDecisionDue = ({ day, month, year} ) => {
  if(day) getDateDecisionDueDay().clear().type(day);
  if(month) getDateDecisionDueMonth().clear().type(month);
  if(year) getDateDecisionDueYear().clear().type(year);
}

export const verifyHighlightsDecisionDue = (highlights) => {
  const highlightsList = highlights.split(',') || [highlights];

  highlightsList.forEach(input => {
    cy.get(`#decision-date-${input}`).should('have.class','govuk-input--error');
  });
}
