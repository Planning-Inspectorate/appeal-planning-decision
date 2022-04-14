import { Before } from 'cypress-cucumber-preprocessor/steps';
export const pageURLAppeal = {
   goToAppealStatementInfoPage: 'eligibility/appeal-statement' ,
   goToAppealStatementPage: 'appellant-submission/appeal-statement' ,
   goToAppealStatementSubmission: 'appellant-submission/appeal-statement' ,
   goToApplicantNamePage: 'appellant-submission/applicant-name' ,
   goToCheckYourAnswersPage : 'appellant-submission/check-answers' ,
   goToConfirmationPage: 'appellant-submission/confirmation' ,
   goToCookiePreferences : 'cookies',
   goToCostsPage: 'before-you-start/claiming-costs-householder' ,
   goToDecisionDateExpiredPage: 'eligibility/decision-date-passed' ,
   goToDecisionDatePage: 'before-you-start/decision-date-householder' ,
   goToDecisionLetterPage: 'appellant-submission/upload-decision' ,
   goToEnforcementNoticeOutPage: 'before-you-start/use-a-different-service' ,
   goToEnforcementNoticePage: 'before-you-start/enforcement-notice-householder' ,
   goToGrantedOrRefusedPermissionOutPage: 'before-you-start/use-a-different-service',
   goToGrantedOrRefusedPermissionPage: 'eligibility/granted-or-refused-permission',
   goToSiteAccessPage:'appellant-submission/site-access',
   goToHealthAndSafetyPage: 'appellant-submission/site-access-safety' ,
   goToHouseholderPlanningPermissionQuestionPage: 'eligibility/householder-planning-permission' ,
   goToHouseholderQuestionOutPage: 'before-you-start/use-a-different-service' ,
   //goToHouseholderQuestionPage : (''eligibility/householder-planning-permission/',{ script: false }),
  goToHouseholderQuestionPage : 'eligibility/householder-planning-permission/',
   goToLandingPage: '' ,
   goToListedBuildingOutPage: 'before-you-start/use-a-different-service' ,
   goToListedBuildingPage: 'eligibility/listed-building' ,
   goToLocalPlanningDepartment: 'before-you-start/local-planning-depart' ,
   goToNoDecisionOnPermissionPage: 'eligibility/no-decision' ,
   goToOtherSiteOwnerToldPage: 'appellant-submission/site-ownership-certb' ,
   goToPageAfterYouAppeal: 'after-you-appeal' ,
   goToPageBeforeYouAppeal: 'before-you-appeal' ,
   goToPageNotFoundPage: 'page-not-found' ,
   goToPageStagesOfAnAppeal: 'stages-of-an-appeal' ,
  // Householder journey
   goToTypeOfPlanningApplication: 'before-you-start/type-of-planning-application',
   goToPlanningApplicationGrantedOrRefused: 'before-you-start/granted-or-refused-householder',

   //cy.visit(''appellant-submission/site-access', { failOnStatusCode: false });
   goToPageStartYourAppeal : 'start-your-appeal',
    goToPageWhenYouCanAppeal: 'when-you-can-appeal' ,
   goToPlanningApplicationNumberPage: 'appellant-submission/application-number' ,
   goToPlanningApplicationSubmission: 'appellant-submission/upload-application' ,
   goToPlanningDepartmentOutPage: 'before-you-start/use-a-different-service' ,
   goToPlanningDepartmentPage: 'before-you-start/local-planning-depart' ,
   goToPlanningDepartmentPageWithoutJs: ('eligibility/planning-department', {script:false}),
   goToSiteAddressPage : 'appellant-submission/site-location',
   goToSiteSafetyPage: 'appellant-submission/site-access-safety' ,
   goToStartAppealPage: 'eligibility/' ,
   goToSubmissionInformationPage: 'appellant-submission/submission-information' ,
   goToSubmissionPage: 'appellant-submission/submission' ,
   goToSupportingDocumentsPage: 'appellant-submission/supporting-documents' ,
   goToTaskListPage : 'appellant-submission/task-list',
   goToWhoAreYouPage: 'appellant-submission/who-are-you' ,
   goToWholeSiteOwnerPage: 'appellant-submission/site-ownership' ,
   goToYourDetailsPage: 'appellant-submission/your-details',
   confirmNavigationHouseholderQuestionPage: 'eligibility/householder-planning-permission'

}
//let disableJs = false;
 Before(() => {
   cy.wrap(pageURLAppeal).as('pageURLAppeal');
   //disableJs = false;
 });

















