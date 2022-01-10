import {getIsListedBuilding, getIsNotListedBuilding} from '../page-objects/listed-building-po'

export const selectListedBuildingDecision = (decision)=>{
    switch(decision){
        case 'Yes':
            getIsListedBuilding().check();
            break;
        case 'No':
            getIsNotListedBuilding().check();
            break;
    }
}
