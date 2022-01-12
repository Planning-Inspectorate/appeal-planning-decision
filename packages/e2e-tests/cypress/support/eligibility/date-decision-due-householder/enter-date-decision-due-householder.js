import {
  getDateDecisionDueHouseholderDay,
  getDateDecisionDueHouseholderMonth, getDateDecisionDueHouseholderYear
} from "../page-objects/date-decision-due-householder-po";

export const enterDateDecisionDueHouseholder = ({ day, month, year} ) => {
  if(day) getDateDecisionDueHouseholderDay().clear().type(day);
  if(month) getDateDecisionDueHouseholderMonth().clear().type(month);
  if(year) getDateDecisionDueHouseholderYear().clear().type(year);
}

export const verifyHighlightsDecisionDueHouseholder = (highlights) => {
  const highlightsList = highlights.split(',') || [highlights];

  highlightsList.forEach(input => {
    cy.get(`#date-decision-due-householder-${input}`).should('have.class','govuk-input--error');
  });

}
