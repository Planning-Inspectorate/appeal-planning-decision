import {
  getFullPlanningRadio,
  getHouseHolderPlanningRadio, getNoApplicationMadeRadio,
  getOutlinePlanningRadio,
  getPriorApprovalPlanningRadio,
  getRemovalOrVariationOfConditionsRadio,
  getReservedMattersPlanningRadio, getSomethingElseRadio,
} from '../page-objects/planning-application-type-po';

export const selectPlanningApplicationType = (applicationType)=>{
  switch(applicationType){
    case 'Householder':
      getHouseHolderPlanningRadio().click();
      break;
    case 'Full planning':
      getFullPlanningRadio().click();
      break;
    case 'Outline planning':
      getOutlinePlanningRadio().click();
      break;
    case 'Prior approval':
      getPriorApprovalPlanningRadio().click();
      break;
    case 'Reserved matters':
      getReservedMattersPlanningRadio().click();
      break;
    case 'Removal or variation of conditions':
      getRemovalOrVariationOfConditionsRadio().click();
      break;
    case 'Something else':
      getSomethingElseRadio().click();
      break;
    case 'I have not made a planning application':
      getNoApplicationMadeRadio().click();
      break;
  }

}
