import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

//Given the Householder planning appeal questionnaire page is presented
Given("The Householder planning appeal questionnaire page is presented", ()=> {
    cy.goToAppealsQuestionnaireTasklistPage();

});

Given(`The User clicks on {string}`,(taskname)=>{
  let name ='';
  switch(taskname){
    case 'About the appeal - Review accuracy of the appellant\'s submission' :
      name='submissionAccuracy';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToReviewAccuracyOfTheAppellantSubmissionPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'About the appeal - Do you have any extra conditions?':
      name='extraConditions';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToExtraConditionsPage();
      cy.validateExtraConditionsPageTitle();
      break;
    case 'About the appeal - Tell us about any appeals in the immediate area' :
      name='otherAppeals';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToTellUsAboutAppealsInImmediateAreaPage();
      cy.validateAppealsPageTitle();
      break;
    case 'About the appeal site - Tell us about the appeal site' :
      name='aboutSite';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToTellUsAboutAppealSitePage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Required documents - Upload the plans used to reach the decision' :
      name='plansDecision';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToUploadThePlansUsedToReachDecisionPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Required documents - Upload the Planning Officer\'s report' :
      name='officersReport';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToUploadPlanningOfficersReportPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Telling interested parties about the application' :
      name='interestedPartiesApplication';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToTellingInterestedPartiesAboutTheApplicationPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Representations from interested parties' :
      name='representationsInterestedParties';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToRepresentationsFromInterestedPartiesPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Notifying interested parties of the appeal' :
      name='interestedPartiesAppeal';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToNotifyingInterestedPartiesOfTheAppealPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Site notices' :
      name='siteNotices';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToSiteNoticesPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Planning history' :
      name='planningHistory';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToPlanningHistoryPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Statutory development plan policy' :
      name='statutoryDevelopment';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToStatutoryDevelopmentPlanPolicyPage();
      cy.validatePageHolderPageLoad();
      break;
    case  'Optional supporting documents - Other relevant policies' :
      name='otherPolicies';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToOtherRelevantPoliciesPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Supplementary planning document extracts' :
      name='supplementaryPlanningDocuments';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToSupplementaryPlanningDocumentsExtractPage();
      cy.validatePageHolderPageLoad();
      break;
    case 'Optional supporting documents - Development Plan Document or Neighbourhood Plan' :
      name='developmentOrNeighbourhood';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      cy.goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage();
      cy.validatePageHolderPageLoad();
    break;
    default:
      throw new Error('Unknown task name = ' + taskname);
    }
})

//When User clicks on Back button
When(`User clicks on Back button`,()=>{
  cy.go('back');
})

//Then User is navigated to Householder questionnaire page
Then(`User is navigated to Householder questionnaire page`,()=>{
  cy.goToAppealsQuestionnaireTasklistPage();
})

Then(`The task {string} is available for selection`,(taskname)=>{
  let name='';
  switch(taskname){
    case 'About the appeal - Review accuracy of the appellant\'s submission' :
      name='submissionAccuracy';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'About the appeal - Do you have any extra conditions?':
      name='extraConditions';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'About the appeal - Tell us about any appeals in the immediate area' :
      name='otherAppeals';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'About the appeal site - Tell us about the appeal site' :
      name='aboutSite';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Required documents - Upload the plans used to reach the decision' :
      name='plansDecision';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Required documents - Upload the Planning Officer\'s report' :
      name='officersReport';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Telling interested parties about the application' :
      name='interestedPartiesApplication';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Representations from interested parties' :
      name='representationsInterestedParties';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Notifying interested parties of the appeal' :
      name='interestedPartiesAppeal';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Site notices' :
      name='siteNotices';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Planning history' :
      name='planningHistory';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Statutory development plan policy' :
      name='statutoryDevelopment';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Other relevant policies' :
      name='otherPolicies';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Supplementary planning document extracts' :
      name='supplementaryPlanningDocuments';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
      break;
    case 'Optional supporting documents - Development Plan Document or Neighbourhood Plan' :
      name='developmentOrNeighbourhood';
      cy.clickOnLinksOnAppealQuestionnaireTaskListPage(name);
    break;

    default:
      throw new Error('Unknown task name = ' + taskname);
    }

});

Then(`The state for {string} is displayed to be "NOT STARTED"`,(taskname)=>{
  let name='';
  switch(taskname){
    case 'About the appeal - Review accuracy of the appellant\'s submission' :
      name='submissionAccuracy';
      cy.verifyNotStartedStatus(name);
      break;
    case 'About the appeal - Do you have any extra conditions?':
      name='extraConditions';
      cy.verifyNotStartedStatus(name);
      break;
    case 'About the appeal - Tell us about any appeals in the immediate area' :
      name='otherAppeals';
      cy.verifyNotStartedStatus(name);
      break;
    case 'About the appeal site - Tell us about the appeal site' :
      name='aboutSite';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Required documents - Upload the plans used to reach the decision' :
      name='plansDecision';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Required documents - Upload the Planning Officer\'s report' :
      name='officersReport';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Telling interested parties about the application' :
      name='interestedPartiesApplication';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Representations from interested parties' :
      name='representationsInterestedParties';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Notifying interested parties of the appeal' :
      name='interestedPartiesAppeal';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Site notices' :
      name='siteNotices';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Planning history' :
      name='planningHistory';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Statutory development plan policy' :
      name='statutoryDevelopment';
      cy.verifyNotStartedStatus(name);
      break;
    case  'Optional supporting documents - Other relevant policies' :
      name='otherPolicies';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Supplementary planning document extracts' :
      name='supplementaryPlanningDocuments';
      cy.verifyNotStartedStatus(name);
      break;
    case 'Optional supporting documents - Development Plan Document or Neighbourhood Plan' :
      name='developmentOrNeighbourhood';
      cy.verifyNotStartedStatus(name);
    break;

    default:
      throw new Error('Unknown task name = ' + taskname);
    }
});


Then('The title of the page is "Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK"',()=>{
      cy.verifyTaskListPageTitle();
});

//The state for "Before You submit - Check your answers" is displayed to be "CANNOT START YET"
Then('The state for "Before You submit - Check your answers" is displayed to be "CANNOT START YET"',()=>{
    cy.checkYourAnswers();
    cy.verifyCannotStartStatus();
})


Then('The "Use the links below to submit your information. You can complete the sections in any order." is displayed',()=>{
    cy.get('.govuk-body-l').invoke('text')
    .then(text =>{
      expect(text).to.contain('Use the links below to submit your information. You can complete the sections in any order.')
    })
})

Then('The "Only include documents that were considered when making a decision on the application." is displayed in Optional Supporting Documents', () => {
  cy.get('[data-cy="task-list--optionalDocumentsSection"]').invoke('text')
  .then(text => {
    expect(text).to.contain('Only include documents that were considered when making a decision on the application.')
  })
})
