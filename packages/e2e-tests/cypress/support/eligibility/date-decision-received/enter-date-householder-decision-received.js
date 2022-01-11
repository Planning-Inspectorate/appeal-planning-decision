import {
  getDateHouseholderDecisionReceivedDay,
  getDateHouseholderDecisionReceivedMonth,
  getDateHouseholderDecisionReceivedYear,
} from '../page-objects/date-decision-received-po';

export const enterDateHouseholderDecisionReceived =({ day, month, year})=>{
  if(day) getDateHouseholderDecisionReceivedDay().clear().type(day);
  if(month) getDateHouseholderDecisionReceivedMonth().clear().type(month);
  if(year) getDateHouseholderDecisionReceivedYear().clear().type(year);
}

export const verifyHouseholderDecisionDatesHighlights = (highlights) => {
  const highlightsList = highlights.split(',') || [highlights];

  highlightsList.forEach(input => {
    cy.get(`#decision-date-householder-${input}`).should('have.class','govuk-input--error');
  });
}
