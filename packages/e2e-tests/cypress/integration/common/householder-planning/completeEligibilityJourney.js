import {Given} from 'cypress-cucumber-preprocessor/steps'
import {
  goToHouseholderAppealSubmitAppealTaskList
} from "../../../support/householder-planning/appeals-service/goToHouseholderAppealSubmitAppealTaskList";

Given('appellant has completed householder appeal eligibility journey',()=>{
  goToHouseholderAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Householder');
});
