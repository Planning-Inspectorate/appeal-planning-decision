class AppealsQuestionnaireTaskList {
  getSubmissionAccuracy(){
    return cy.get('a[data-cy="submissionAccuracy"]');
  }

  getExtraConditions(){
    return cy.get('a[data-cy="extraConditions"]');
  }


  getAreaAppeals(){
    return cy.get('a[data-cy="areaAppeals"]');
  }

  getAboutSite(){
    return cy.get('a[data-cy="aboutSite"]');
  }

  getPlansDecision(){
    return cy.get('a[data-cy="plansDecision"]');
  }

  getOfficersReport(){
    return cy.get('a[data-cy="officersReport"]');
  }

  getInterestedPartiesApplication(){
    return cy.get('a[data-cy="interestedPartiesApplication"]');
  }

  getRepresentationsInterestedParties(){
    return cy.get('a[data-cy="representationsInterestedParties"]');
  }

  getInterestedPartiesAppeal(){
    return cy.get('a[data-cy="interestedPartiesAppeal"]');
  }

  getSiteNotices(){
    return cy.get('a[data-cy="siteNotices"]');
  }

  getPlanningHistory(){
    return cy.get('a[data-cy="planningHistory"]');
  }

  getStatutoryDevelopment(){
    return cy.get('a[data-cy="statutoryDevelopment"]');
  }

  getOtherPolicies(){
    return cy.get('a[data-cy="otherPolicies"]');
  }

  getSupplementaryPlanningDocuments(){
    return cy.get('a[data-cy="supplementaryPlanningDocuments"]');
  }

  getDevelopmentOrNeighbourhood(){
    return cy.get('a[data-cy="developmentOrNeighbourhood"]');
  }

  getCheckYourAnswers(){
    return cy.get('a[data-cy="checkYourAnswers"]');
  }
}

export default AppealsQuestionnaireTaskList;
