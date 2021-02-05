class AppealsQuestionnaireTaskList {
  getSubmissionAccuracy(){
    return cy.get('a[data-cy="submissionAccuracy"]');
  }

  getExtraConditions(){
    return cy.get('a[data-cy="extraConditions"]');
  }

  getOtherAppeals(){
    return cy.get('a[data-cy="otherAppeals"]');
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

  checkYourAnswers(){
    return cy.get('span[data-cy="checkYourAnswers"]');
  }
  checkNotstartedTaskStatus(taskName){
    return cy.get('li['+taskName+'-status="NOT STARTED"]');
  }

  checkCompletedTaskStatus(taskName){
    return cy.get('li['+taskName+'-status="COMPLETED"]');
  }


  checkCannotStartStatus(){
    return cy.get('li[checkyouranswers-status="CANNOT START YET"]');
  }
  getPlaceholderPageTitle(){
    return cy.get('h1[class="govuk-heading-l"]');
  }

}

export default AppealsQuestionnaireTaskList;
