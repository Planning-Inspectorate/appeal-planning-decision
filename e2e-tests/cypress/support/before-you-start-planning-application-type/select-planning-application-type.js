import { getFullPlanningRadio, getHouseHolderPlanningRadio } from '../page-objects/planning-application-type-po';

export const selectPlanningApplicationType = (applicationType)=>{
  if(applicationType==='Householder')
    getHouseHolderPlanningRadio().click();
  else if(applicationType === 'Full planning')
    getFullPlanningRadio().click();
  
}
