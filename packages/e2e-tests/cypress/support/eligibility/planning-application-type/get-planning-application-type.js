import {
  getFullAppealRadio,
  getHouseHolderPlanningRadio, getNoApplicationMadeRadio,
  getOutlinePlanningRadio,
  getPriorApprovalPlanningRadio,
  getRemovalOrVariationOfConditionsRadio,
  getReservedMattersPlanningRadio, getSomethingElseRadio
} from "../page-objects/planning-application-type-po";

export const getPlanningApplicationType =(applicationType)=>{
  switch (applicationType) {
    case 'Householder':
      getHouseHolderPlanningRadio().should('be.checked');
      break;
    case 'Full planning':
      getFullAppealRadio().should('be.checked');
      break;
    case 'Outline planning':
      getOutlinePlanningRadio().should('be.checked');
      break;
    case 'Prior approval':
      getPriorApprovalPlanningRadio().should('be.checked');
      break;
    case 'Reserved matters':
      getReservedMattersPlanningRadio().should('be.checked');
      break;
    case 'Removal or variation of conditions':
      getRemovalOrVariationOfConditionsRadio().should('be.checked');
      break;
    case 'Something else':
      getSomethingElseRadio().should('be.checked');
      break;
    case 'I have not made a planning application':
      getNoApplicationMadeRadio().should('be.checked');
      break;
  }
}
