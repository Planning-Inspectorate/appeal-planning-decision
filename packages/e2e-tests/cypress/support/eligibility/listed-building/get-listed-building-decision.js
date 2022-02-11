import {getIsListedBuilding, getIsNotListedBuilding} from "../page-objects/listed-building-po";

export const getListedBuildingDecision=(decision)=>{
  switch(decision){
    case 'Yes':
      getIsListedBuilding().should('be.checked');
      break;
    case 'No':
      getIsNotListedBuilding().should('be.checked');
      break;
  }
}
