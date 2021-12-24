import {
  getDateHouseholderDecisionReceivedDay,
  getDateHouseholderDecisionReceivedMonth,
  getDateHouseholderDecisionReceivedYear
} from "../page-objects/date-decision-received-po";

export const enterDateDecisionReceived = ({ day, month, year} ) => {
  if(day) getDateHouseholderDecisionReceivedDay().clear().type(day);
  if(month) getDateHouseholderDecisionReceivedMonth().clear().type(month);
  if(year) getDateHouseholderDecisionReceivedYear().clear().type(year);
}
