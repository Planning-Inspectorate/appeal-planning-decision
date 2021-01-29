/// <reference types="Cypress" />

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the Householder planning appeal questionnaire page is presented',()=>{
    cy.goToAppealsQuestionnaireTaskListPage();

});

Then('And the task {string} is available for selection',(taskname)=>{
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

Then('the state for {string} is displayed to be "NOT STARTED"',(taskname)=>{
  switch(taskname){
    case 'About the appeal - Review accuracy of the appellant\'s submission' :
      cy.goToReviewAccuracyOfTheAppellantSubmissionPage();
      cy.verifyNotStartedStatus();
      break;
    case 'About the appeal - Do you have any extra conditions?':
      cy.goToExtraConditionsPage();
      cy.verifyNotStartedStatus();
      break;
    case 'About the appeal - Tell us about any appeals in the immediate area' :
      cy.goToTellUsAboutAppealsInImmediateAreaPage();
      cy.verifyNotStartedStatus();
      break;
    case 'About the appeal site - Tell us about the appeal site' :
      cy.goToTellUsAboutAppealSitePage();
      cy.verifyNotStartedStatus();
      break;
    case 'Required documents - Upload the plans used to reach the decision' :
      cy.goToUploadThePlansUsedToReachDecisionPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Required documents - Upload the Planning Officer\'s report' :
      cy.goToUploadPlanningOfficersReportPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Telling interested parties about the application' :
      cy.goToTellingInterestedPartiesAboutTheApplicationPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Representations from interested parties' :
      cy.goToRepresentationsFromInterestedPartiesPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Notifying interested parties of the appeal' :
      cy.goToNotifyingInterestedPartiesOfTheAppealPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Site notices' :
      cy.goToSiteNoticesPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Planning history' :
      cy.goToPlanningHistoryPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Statutory development plan policy' :
      cy.goToStatutoryDevelopmentPlanPolicyPage();
      cy.verifyNotStartedStatus();
      break;
    case  'Optional supporting documents - Other relevant policies' :
      cy.goToOtherRelevantPoliciesPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Supplementary planning document extracts' :
      cy.goToSupplementaryPlanningDocumentsExtractPage();
      cy.verifyNotStartedStatus();
      break;
    case 'Optional supporting documents - Development Plan Document or Neighbourhood Plan' :
      cy.goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage();
      cy.verifyNotStartedStatus();
    break;

    default:
      throw new Error('Unknown task name = ' + taskname);
    }
});
Then('The page title of the page is "Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK"',()=>{
  describe('Verify the page title',()=>{
    it('should be "Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK"',()=>{
      cy.title().should('eq','Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK' )
    })
  })
});

Then('the state for "Before You submit - Check your answers" is displayed to be "CANNOT START YET"',()=>{
  describe('Verify the status of Check your answers',()=>{
    it('should be Cannot start yet',()=>{
      cy.contains('Check your answers').should('have.text','Cannot start yet');
    })
  })
})
