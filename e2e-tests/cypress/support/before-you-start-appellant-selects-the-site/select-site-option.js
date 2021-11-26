import {
  getListedBuildingOption,
  getMajorDwellingsOption,
  getMajorGeneralIndustryStorageOrWarehousingOption,
  getMajorRetailAndServicesOption,
  getMajorTravellingAndCaravanPitchesOption,
  getNoneOfTheseOption,
} from '../page-objects/appellant-selects-the-site-po';

export const selectSiteOption = (option) =>{
   switch (option){
     case 'None of these':
       getNoneOfTheseOption().click();
       break;
     case 'A listed building':
       getListedBuildingOption().click();
       break;
     case 'Major dwellings':
        getMajorDwellingsOption().click();
        break;
     case 'Major general industry, storage or warehousing':
       getMajorGeneralIndustryStorageOrWarehousingOption().click();
       break;
     case 'Major retail and services':
       getMajorRetailAndServicesOption().click();
       break;
     case 'Major travelling and caravan pitches':
       getMajorTravellingAndCaravanPitchesOption().click();
       break;
   }
}
