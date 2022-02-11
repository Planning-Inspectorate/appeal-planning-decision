import {
  getDateDecisionDueDay,
  getDateDecisionDueMonth,
  getDateDecisionDueYear
} from "../page-objects/date-decision-due-po";

export const getDateDecisionDue =({ day, month, year})=>{
  if(day) getDateDecisionDueDay().should('have.value',day);
  if(month) getDateDecisionDueMonth().should('have.value',month);
  if(year) getDateDecisionDueYear().should('have.value',year);
}
