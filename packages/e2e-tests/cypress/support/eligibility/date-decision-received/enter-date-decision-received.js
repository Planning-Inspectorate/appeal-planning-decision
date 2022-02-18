import {
  getDateDecisionReceivedDay, getDateDecisionReceivedMonth, getDateDecisionReceivedYear,
} from '../page-objects/date-decision-received-po';

export const enterDateDecisionReceived = ({ day, month, year} ) => {
  if(day) getDateDecisionReceivedDay().clear().type(day);
  if(month) getDateDecisionReceivedMonth().clear().type(month);
  if(year) getDateDecisionReceivedYear().clear().type(year);
}
