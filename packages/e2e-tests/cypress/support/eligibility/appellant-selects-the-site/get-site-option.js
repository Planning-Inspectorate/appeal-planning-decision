import {
  getListedBuildingOption,
  getMajorDwellingsOption,
  getMajorGeneralIndustryStorageOrWarehousingOption,
  getMajorRetailAndServicesOption,
  getMajorTravellingAndCaravanPitchesOption,
  getNoneOfTheseOption
} from "../page-objects/appellant-selects-the-site-po";

export const getSiteOption = (option)=>{
  switch (option){
    case 'None of these':
      getNoneOfTheseOption().should('be.checked');
      break;
    case 'A listed building':
      getListedBuildingOption().should('be.checked');
      break;
    case 'Major dwellings':
      getMajorDwellingsOption().should('be.checked');
      break;
    case 'Major general industry, storage or warehousing':
      getMajorGeneralIndustryStorageOrWarehousingOption().should('be.checked');
      break;
    case 'Major retail and services':
      getMajorRetailAndServicesOption().should('be.checked');
      break;
    case 'Major travelling and caravan pitches':
      getMajorTravellingAndCaravanPitchesOption().should('be.checked');
      break;
  }
}
