import {
  getDateDecisionReceivedDay, getDateDecisionReceivedMonth, getDateDecisionReceivedYear,
} from '../page-objects/date-decision-received-po';

export const enterDateDecisionReceived = ({ day, month, year} ) => {
  if(day) getDateDecisionReceivedDay().clear().type(day);
  if(month) getDateDecisionReceivedMonth().clear().type(month);
  if(year) getDateDecisionReceivedYear().clear().type(year);
}

export const verifyDecisionDatesHighlights = (highlights) => {
  const highlightsList = highlights.split(',') || [highlights];

  highlightsList.forEach(input => {
    cy.get(`#decision-date-${input}`).should('have.class', 'govuk-input--error');
  });
}
