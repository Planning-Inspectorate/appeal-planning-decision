import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

//Given the Householder planning appeal questionnaire page is presented
Given("The Householder planning appeal questionnaire page is presented", ()=> {
    cy.goToAppealsQuestionnaireTasklistPage();

});

Given(`The User clicks on {string}`,(taskname)=>{
  switch(taskname){
    case 'About the appeal - Review accuracy of the appellant\'s submission' :
      cy.goToReviewAccuracyOfTheAppellantSubmissionPage();
      break;
    case 'About the appeal - Do you have any extra conditions?':
      cy.goToExtraConditionsPage();
      break;
    case 'About the appeal - Tell us about any appeals in the immediate area' :
      cy.goToTellUsAboutAppealsInImmediateAreaPage();
      break;
    case 'About the appeal site - Tell us about the appeal site' :
      cy.goToTellUsAboutAppealSitePage();
      break;
    case 'Required documents - Upload the plans used to reach the decision' :
      cy.goToUploadThePlansUsedToReachDecisionPage();
      break;
    case 'Required documents - Upload the Planning Officer\'s report' :
      cy.goToUploadPlanningOfficersReportPage();
      break;
    case 'Optional supporting documents - Telling interested parties about the application' :
      cy.goToTellingInterestedPartiesAboutTheApplicationPage();
      break;
    case 'Optional supporting documents - Representations from interested parties' :
      cy.goToRepresentationsFromInterestedPartiesPage();
      break;
    case 'Optional supporting documents - Notifying interested parties of the appeal' :
      cy.goToNotifyingInterestedPartiesOfTheAppealPage();
      break;
    case 'Optional supporting documents - Site notices' :
      cy.goToSiteNoticesPage();
      break;
    case 'Optional supporting documents - Planning history' :
      cy.goToPlanningHistoryPage();
      break;
    case 'Optional supporting documents - Statutory development plan policy' :
      cy.goToStatutoryDevelopmentPlanPolicyPage();
      break;
    case  'Optional supporting documents - Other relevant policies' :
      cy.goToOtherRelevantPoliciesPage();
      break;
    case 'Optional supporting documents - Supplementary planning document extracts' :
      cy.goToSupplementaryPlanningDocumentsExtractPage();
      break;
    case 'Optional supporting documents - Development Plan Document or Neighbourhood Plan' :
      cy.goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage();
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
  switch(taskname){
    case 'About the appeal - Review accuracy of the appellant\'s submission' :
      cy.goToReviewAccuracyOfTheAppellantSubmissionPage();
      break;
    case 'About the appeal - Do you have any extra conditions?':
      cy.goToExtraConditionsPage();
      break;
    case 'About the appeal - Tell us about any appeals in the immediate area' :
      cy.goToTellUsAboutAppealsInImmediateAreaPage();
      break;
    case 'About the appeal site - Tell us about the appeal site' :
      cy.goToTellUsAboutAppealSitePage();
      break;
    case 'Required documents - Upload the plans used to reach the decision' :
      cy.goToUploadThePlansUsedToReachDecisionPage();
      break;
    case 'Required documents - Upload the Planning Officer\'s report' :
      cy.goToUploadPlanningOfficersReportPage();
      break;
    case 'Optional supporting documents - Telling interested parties about the application' :
      cy.goToTellingInterestedPartiesAboutTheApplicationPage();
      break;
    case 'Optional supporting documents - Representations from interested parties' :
      cy.goToRepresentationsFromInterestedPartiesPage();
      break;
    case 'Optional supporting documents - Notifying interested parties of the appeal' :
      cy.goToNotifyingInterestedPartiesOfTheAppealPage();
      break;
    case 'Optional supporting documents - Site notices' :
      cy.goToSiteNoticesPage();
      break;
    case 'Optional supporting documents - Planning history' :
      cy.goToPlanningHistoryPage();
      break;
    case 'Optional supporting documents - Statutory development plan policy' :
      cy.goToStatutoryDevelopmentPlanPolicyPage();
      break;
    case  'Optional supporting documents - Other relevant policies' :
      cy.goToOtherRelevantPoliciesPage();
      break;
    case 'Optional supporting documents - Supplementary planning document extracts' :
      cy.goToSupplementaryPlanningDocumentsExtractPage();
      break;
    case 'Optional supporting documents - Development Plan Document or Neighbourhood Plan' :
      cy.goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage();
    break;

    default:
      throw new Error('Unknown task name = ' + taskname);
    }

});

Then(`The state for {string} is displayed to be "NOT STARTED"`,(taskname)=>{
  var name='';
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
      name='areaAppeals';
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
      cy.title().should('eq','Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK' )
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
