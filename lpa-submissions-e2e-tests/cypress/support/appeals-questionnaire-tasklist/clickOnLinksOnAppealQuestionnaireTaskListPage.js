 /// <reference types = "Cypress"/>
 import AppealsQuestionnaireTaskList from '../PageObjects/appeals-questionnaire-tasklist-pageobjects';
 const tasklist = new AppealsQuestionnaireTaskList()

module.exports = (taskname) =>{
  switch(taskname){
    case 'submissionAccuracy':
      tasklist.getSubmissionAccuracy().click();
      break;
    case 'extraConditions':
      tasklist.getExtraConditions().click();
      break;
    case 'areaAppeals':
      tasklist.getAreaAppeals().click();
      break;
    case 'aboutSite':
      tasklist.getAboutSite().click();
      break;
    case 'plansDecision':
      tasklist.getPlansDecision().click();
      break;
    case 'officersReport':
      tasklist.getOfficersReport().click();
      break;
    case 'interestedPartiesApplication':
      tasklist.getInterestedPartiesApplication().click();
      break;
    case 'representationsInterestedParties':
      tasklist.getRepresentationsInterestedParties().click();
      break;
    case 'interestedPartiesAppeal':
      tasklist.getInterestedPartiesAppeal().click();
      break;
    case 'siteNotices':
      tasklist.getSiteNotices().click();
      break;
    case 'planningHistory':
      tasklist.getPlanningHistory().click();
      break;
    case 'statutoryDevelopment':
      tasklist.getStatutoryDevelopment().click();
      break;
    case 'otherPolicies':
      tasklist.getOtherPolicies().click();
      break;
    case 'supplementaryPlanningDocuments':
      tasklist.getSupplementaryPlanningDocuments().click();
      break;
    case 'developmentOrNeighbourhood':
      tasklist.getDevelopmentOrNeighbourhood().click();
      break;
  }

}
