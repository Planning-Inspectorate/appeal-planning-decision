import {
  getDateDecisionDueHouseholderDay,
  getDateDecisionDueHouseholderMonth, getDateDecisionDueHouseholderYear
} from "../page-objects/date-decision-due-householder-po";

export const getDateDecisionDueHouseholder =({day, month, year})=>{
  if(day) getDateDecisionDueHouseholderDay().should('have.value',day);
  if(month) getDateDecisionDueHouseholderMonth().should('have.value',month);
  if(year) getDateDecisionDueHouseholderYear().should('have.value',year);
}
