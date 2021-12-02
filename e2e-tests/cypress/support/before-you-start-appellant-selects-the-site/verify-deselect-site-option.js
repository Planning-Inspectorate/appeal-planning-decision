import {
  getListedBuildingOption,
  getMajorDwellingsOption,
  getMajorGeneralIndustryStorageOrWarehousingOption,
  getMajorRetailAndServicesOption,
  getMajorTravellingAndCaravanPitchesOption,
  getNoneOfTheseOption,
} from '../page-objects/appellant-selects-the-site-po';

export const verifyDeselectSiteOption = (option)=>{
  switch (option){
    case 'None of these':
      getNoneOfTheseOption().should('not.be.checked');
      break;
    case 'A listed building':
      getListedBuildingOption().should('not.be.checked');
      break;
    case 'Major dwellings':
      getMajorDwellingsOption().should('not.be.checked');
      break;
    case 'Major general industry, storage or warehousing':
      getMajorGeneralIndustryStorageOrWarehousingOption().should('not.be.checked');
      break;
    case 'Major retail and services':
      getMajorRetailAndServicesOption().should('not.be.checked');
      break;
    case 'Major travelling and caravan pitches':
      getMajorTravellingAndCaravanPitchesOption().should('not.be.checked');
      break;
  }
}
