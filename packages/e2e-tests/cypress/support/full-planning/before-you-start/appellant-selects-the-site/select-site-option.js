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
       getNoneOfTheseOption().check();
       break;
     case 'A listed building':
       getListedBuildingOption().check();
       break;
     case 'Major dwellings':
        getMajorDwellingsOption().check();
        break;
     case 'Major general industry, storage or warehousing':
       getMajorGeneralIndustryStorageOrWarehousingOption().check();
       break;
     case 'Major retail and services':
       getMajorRetailAndServicesOption().check();
       break;
     case 'Major travelling and caravan pitches':
       getMajorTravellingAndCaravanPitchesOption().check();
       break;
   }
}
