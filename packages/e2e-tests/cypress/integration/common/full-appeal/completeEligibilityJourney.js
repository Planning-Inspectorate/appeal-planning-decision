import {Given} from 'cypress-cucumber-preprocessor/steps'
import {
  goToFullAppealSubmitAppealTaskList
} from "../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList";

Given('appellant has completed full appeal eligibility journey',()=>{
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-department','Full planning');
});
