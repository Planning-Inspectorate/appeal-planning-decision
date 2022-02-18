import {
  getDateDecisionReceivedDay,
  getDateDecisionReceivedMonth,
  getDateDecisionReceivedYear
} from "../page-objects/date-decision-received-po";

export const getDateDecisionReceived =({day, month, year})=>{
  if(day) getDateDecisionReceivedDay().should('have.value',day);
  if(month) getDateDecisionReceivedMonth().should('have.value',month);
  if(year) getDateDecisionReceivedYear().should('have.value',year);
}
