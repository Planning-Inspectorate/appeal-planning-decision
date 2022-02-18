import {
  getGrantedRadio,
  getNoDecisionReceivedRadio,
  getRefusedRadio
} from "../page-objects/granted-or-refused-application-po";

export const getPlanningApplicationDecision =(decision)=>{
  switch(decision){
    case 'Granted':
      getGrantedRadio().should('be.checked');
      break;
    case 'Refused':
      getRefusedRadio().should('be.checked');
      break;
    case 'I have Not Received a Decision':
      getNoDecisionReceivedRadio().should('be.checked');
      break;
    case 'I have not received a decision':
      getNoDecisionReceivedRadio().should('be.checked');
      break;
  }
}
