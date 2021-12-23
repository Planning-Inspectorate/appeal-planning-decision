import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { confirmTermsAndConditionsLinkDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmTermsAndConditionsLinkDisplayed';
import { confirmPrivacyLinkDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmPrivacyLinkDisplayed';
import { confirmCookiesLinkDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmCookiesLinkDisplayed';
import { confirmAccessibilityLinkDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmAccessibilityLinkDisplayed';
import { confirmFeedbackLinkIsDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmFeedbackLinkIsDisplayed';
import { confirmHomepageLinkIsDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmHomepageLinkIsDisplayed';
import { confirmBackButtonNotDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmBackButtonNotDisplayed';
import { confirmBackButtonDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmBackButtonDisplayed';
import { confirmGoogleAnalyticsLinkIsPresent } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmGoogleAnalyticsLinkIsPresent';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from './pageURLAppeal';

Given('an appeal is being made', () => {});

When('the {string} page is presented', (page) => {
  switch (page) {
    case 'Start your appeal':
      goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
      break;
    case 'Eligibility - House holder planning permission':
      goToAppealsPage(pageURLAppeal.goToHouseholderQuestionPage);
      break;
    case 'Eligibility - Householder planning permission out':
      goToAppealsPage(pageURLAppeal.goToHouseholderQuestionOutPage);
      break;
    case 'Eligibility - Granted Or Refused Permission':
      goToAppealsPage(pageURLAppeal.goToGrantedOrRefusedPermissionPage);
        break;
    case 'Eligibility - Granted Or Refused Permission Out':
      goToAppealsPage(pageURLAppeal.goToGrantedOrRefusedPermissionOutPage);
      break;
    case 'Eligibility - No decision on Permission':
      goToAppealsPage(pageURLAppeal.goToNoDecisionOnPermissionPage);
      break;
    case 'Eligibility - Decision date':
      goToAppealsPage(pageURLAppeal.goToDecisionDatePage);
      break;
    case 'Eligibility - Decision date expired':
      goToAppealsPage(pageURLAppeal.goToDecisionDateExpiredPage);
      break;
    case 'Eligibility - Planning department':
      goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
      break;
    case 'Eligibility - Planning department out':
      goToAppealsPage(pageURLAppeal.goToPlanningDepartmentOutPage);
      break;
    case 'Enforcement - Notice':
      goToAppealsPage(pageURLAppeal.goToEnforcementNoticePage);
      break;
    case 'Enforcement - Notice out':
      goToAppealsPage(pageURLAppeal.goToEnforcementNoticeOutPage);
      break;
    case 'Eligibility - Listed building':
      goToAppealsPage(pageURLAppeal.goToListedBuildingPage);
      break;
    case 'Eligibility - Listed building out':
      goToAppealsPage(pageURLAppeal.goToListedBuildingOutPage);
      break;
    case 'Eligibility - Costs':
      goToAppealsPage(pageURLAppeal.goToListedBuildingPage);
      break;
    case 'Eligibility - Costs out':
      goToAppealsPage(pageURLAppeal.goToListedBuildingOutPage);
      break;
    case 'Eligibility - Appeal statement info':
      goToAppealsPage(pageURLAppeal.goToAppealStatementInfoPage);
      break;
    case 'Appellant submission - Appeal tasks':
      goToAppealsPage(pageURLAppeal.goToTaskListPage);
      break;
    case 'Appellant submission - Your details - Who are you':
      goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
      break;
    case 'Appellant submission - Your details - Your details':
      goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
      break;
    case 'Appellant submission - Your details - Applicant name':
      goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
      break;
    case 'Appellant submission - Planning application - Application number':
      goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);
      break;
    case 'Appellant submission - Planning application - Upload application':
      goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
      break;
    case 'Appellant submission - Planning application - Upload decision letter':
      goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
      break;
    case 'Appellant submission - Your appeal - Appeal statement':
      goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
      break;
    case 'Appellant submission - Your appeal - Supporting documents':
      goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
      break;
    case 'Appellant submission - Appeal site - Site location':
      goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
      break;
    case 'Appellant submission - Appeal site - Site ownership':
      goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
      break;
    case 'Appellant submission - Appeal site - Site ownership certb':
      goToAppealsPage(pageURLAppeal.goToOtherSiteOwnerToldPage);
      break;
    case 'Appellant submission - Appeal site - Site access':
      goToAppealsPage(pageURLAppeal.goToSiteAccessPage);
      break;
    case 'Appellant submission - Appeal site - Site safety':
      goToAppealsPage(pageURLAppeal.goToHealthAndSafetyPage);
      break;
    case 'Appellant submission - Check your answers':
      goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
      break;
    case 'Appeal submission - Declaration':
      goToAppealsPage(pageURLAppeal.goToSubmissionPage);
      break;
    case 'Appeal submission - Confirmation':
      goToAppealsPage(pageURLAppeal.goToConfirmationPage);
      break;
    default:
      throw new Error('This page is unknown = ' + page);
  }
});

Then('the required links are displayed', () => {
  confirmTermsAndConditionsLinkDisplayed();
  confirmPrivacyLinkDisplayed();
  confirmCookiesLinkDisplayed();
  confirmAccessibilityLinkDisplayed();
});

Then('the required header link is displayed', () => {
  confirmFeedbackLinkIsDisplayed();
});

Then('the required GA script is present', () => {
  confirmGoogleAnalyticsLinkIsPresent();
});

Then('the back button is displayed', () => {
  confirmBackButtonDisplayed();
});

Then('the back button is not displayed', () => {
  confirmBackButtonNotDisplayed();
});

Then('the header link is displayed', () => {
  confirmHomepageLinkIsDisplayed();
});
