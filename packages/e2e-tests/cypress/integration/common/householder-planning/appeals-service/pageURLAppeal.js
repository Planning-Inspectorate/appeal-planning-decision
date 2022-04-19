import { Before } from 'cypress-cucumber-preprocessor/steps';
export const pageURLAppeal = {
   goToAppealStatementInfoPage: 'eligibility/appeal-statement' ,
   goToAppealStatementPage: 'appellant-submission/appeal-statement' ,
   goToAppealStatementSubmission: 'appellant-submission/appeal-statement' ,
   goToApplicantNamePage: 'appellant-submission/applicant-name' ,
   goToCheckYourAnswersPage : 'appellant-submission/check-answers' ,
   goToConfirmationPage: 'appellant-submission/confirmation' ,
   goToCookiePreferences : 'cookies',
   goToCostsPage: 'eligibility/costs' ,
   goToDecisionDateExpiredPage: 'eligibility/decision-date-passed' ,
   goToDecisionDatePage: 'eligibility/decision-date' ,
   goToDecisionLetterPage: 'appellant-submission/upload-decision' ,
   goToEnforcementNoticeOutPage: 'eligibility/enforcement-notice-out' ,
   goToEnforcementNoticePage: 'eligibility/enforcement-notice' ,
   goToGrantedOrRefusedPermissionOutPage: 'eligibility/granted-or-refused-permission-out',
   goToGrantedOrRefusedPermissionPage: 'eligibility/granted-or-refused-permission',
   goToSiteAccessPage:'appellant-submission/site-access',
   goToHealthAndSafetyPage: 'appellant-submission/site-access-safety' ,
   goToHouseholderPlanningPermissionQuestionPage: 'eligibility/householder-planning-permission' ,
   goToHouseholderQuestionOutPage: 'eligibility/householder-planning-permission-out' ,
   //goToHouseholderQuestionPage : (''eligibility/householder-planning-permission/',{ script: false }),
  goToHouseholderQuestionPage : 'eligibility/householder-planning-permission/',
   goToLandingPage: '' ,
   goToListedBuildingOutPage: 'before-you-start/use-existing-service-listed-building', // 'eligibility/listed-out' ,
   goToListedBuildingPage: 'eligibility/listed-building' ,
   goToLocalPlanningDepartment: 'before-you-start/local-planning-depart' ,
   goToNoDecisionOnPermissionPage: 'eligibility/no-decision' ,
   goToOtherSiteOwnerToldPage: 'appellant-submission/site-ownership-certb' ,
   goToPageAfterYouAppeal: 'after-you-appeal' ,
   goToPageBeforeYouAppeal: 'before-you-appeal' ,
   goToPageNotFoundPage: 'page-not-found' ,
   goToPageStagesOfAnAppeal: 'stages-of-an-appeal' ,

   //cy.visit(''appellant-submission/site-access', { failOnStatusCode: false });
   goToPageStartYourAppeal : 'start-your-appeal',
   goToPageWhenYouCanAppeal: 'when-you-can-appeal' ,
   goToPlanningApplicationNumberPage: 'appellant-submission/application-number' ,
   goToPlanningApplicationSubmission: 'appellant-submission/upload-application' ,
   goToPlanningDepartmentOutPage: 'eligibility/planning-department-out' ,
   goToPlanningDepartmentPage: 'eligibility/planning-department' ,
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

















