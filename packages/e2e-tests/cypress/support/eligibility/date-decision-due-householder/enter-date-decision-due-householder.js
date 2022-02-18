import {
  getDecisionDateHouseholderDay,
  getDecisionDateHouseholderMonth,
  getDecisionDateHouseholderYear,
} from "../page-objects/date-decision-due-householder-po";

export const enterDateDecisionDueHouseholder = ({ day, month, year} ) => {
  if(day) getDecisionDateHouseholderDay().clear().type(day);
  if(month) getDecisionDateHouseholderMonth().clear().type(month);
  if(year) getDecisionDateHouseholderYear().clear().type(year);
}

export const verifyHighlightsDecisionDueHouseholder = (highlights) => {
  const highlightsList = highlights.split(',') || [highlights];

  highlightsList.forEach(input => {
    cy.get(`#date-decision-due-householder-${input}`).should('have.class','govuk-input--error');
  });

}
