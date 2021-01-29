class AppealsQuestionnaireTaskList {
  getSubmissionAccuracy(){
    return cy.get('a[taskId="submissionAccuracy"]');
  }

  getExtraConditions(){
    return cy.get('a[taskId="extraConditions"]');
  }


  getAreaAppeals(){
    return cy.get('a[taskId="areaAppeals"]');
  }

  getAboutSite(){
    return cy.get('a[taskId="aboutSite"]');
  }

  getPlansDecision(){
    return cy.get('a[taskId="plansDecision"]');
  }

  getOfficersReport(){
    return cy.get('a[taskId="officersReport"]');
  }

  getInterestedPartiesApplication(){
    return cy.get('a[taskId="interestedPartiesApplication"]');
  }

  getRepresentationsInterestedParties(){
    return cy.get('a[taskId="representationsInterestedParties"]');
  }

  getInterestedPartiesAppeal(){
    return cy.get('a[taskId="interestedPartiesAppeal"]');
  }

  getSiteNotices(){
    return cy.get('a[taskId="siteNotices"]');
  }

  getPlanningHistory(){
    return cy.get('a[taskId="planningHistory"]');
  }

  getStatutoryDevelopment(){
    return cy.get('a[taskId="statutoryDevelopment"]');
  }

  getOtherPolicies(){
    return cy.get('a[taskId="otherPolicies"]');
  }

  getSupplementaryPlanningDocuments(){
    return cy.get('a[taskId="supplementaryPlanningDocuments"]');
  }

  getDevelopmentOrNeighbourhood(){
    return cy.get('a[taskId="developmentOrNeighbourhood"]');
  }

  getCheckYourAnswers(){
    return cy.get('a[taskId="checkYourAnswers"]');
  }
}

export default AppealsQuestionnaireTaskList;
