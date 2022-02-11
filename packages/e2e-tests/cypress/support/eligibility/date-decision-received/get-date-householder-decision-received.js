import {
  getDateHouseholderDecisionReceivedDay,
  getDateHouseholderDecisionReceivedMonth, getDateHouseholderDecisionReceivedYear
} from "../page-objects/date-decision-received-po";

export const getDateHouseholderDecisionReceived =({day, month, year})=>{
  if(day) getDateHouseholderDecisionReceivedDay().should('have.value',day);
  if(month) getDateHouseholderDecisionReceivedMonth().should('have.value',month);
  if(year) getDateHouseholderDecisionReceivedYear().should('have.value',year);
}
