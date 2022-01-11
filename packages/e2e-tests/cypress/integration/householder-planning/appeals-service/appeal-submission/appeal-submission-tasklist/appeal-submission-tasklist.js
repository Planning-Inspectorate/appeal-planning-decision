import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { provideAnswerYes } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideAnswerYes';
import { provideDetailsName } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsName';
import { provideDetailsEmail } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsEmail';
import { providePlanningApplicationNumber } from '../../../../support/householder-planning/appeals-service/appellant-submission-planning-application-number/providePlanningApplicationNumber';
import { uploadPlanningApplicationFile } from '../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/uploadPlanningApplicationFile';
import { checkNoSensitiveInformation } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/checkNoSensitiveInformation';
import { uploadAppealStatementFile } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/uploadAppealStatementFile';
import { provideAddressLine1 } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideAddressLine2';
import { provideTownOrCity } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideTownOrCity';
import { provideCounty } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideCounty';
import { providePostcode } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/providePostcode';
import { answerOwnsTheWholeAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerOwnsTheWholeAppeal';
import { answerCanSeeTheWholeAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/answerCanSeeTheWholeAppeal';
import { answerSiteHasNoIssues } from '../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/answerSiteHasNoIssues';
import { uploadDecisionLetterFile } from '../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/uploadDecisionLetterFile';
import { uploadSupportingDocuments } from '../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/uploadSupportingDocuments';
import { provideAnswerNo } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideAnswerNo';
import { answerDoesNotOwnTheWholeAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerDoesNotOwnTheWholeAppeal';
import { confirmBackButtonNotDisplayed } from '../../../../support/householder-planning/appeals-service/appeal-header-footer/confirmBackButtonNotDisplayed';
import { checkStatusForTask } from '../../../../support/householder-planning/appeals-service/appeal-submission-tasklist/checkStatusForTask';
import { confirmTaskIsAvailableForSelection } from '../../../../support/householder-planning/appeals-service/appeal-submission-tasklist/confirmTaskIsAvailableForSelection';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';
import { confirmTaskIsNotAvailableForSelection } from '../../../../support/householder-planning/appeals-service/appeal-submission-tasklist/confirmTaskIsNotAvailableForSelection';

function getTask(sectionTaskName) {
  let name = '';
  let url = '';
  switch (sectionTaskName) {
    case 'About you - Your details':
      name = 'yourDetails';
      url = '/appellant-submission/who-are-you';
      break;
    case 'Planning application - Application number':
      name = 'applicationNumber';
      url = '/appellant-submission/application-number';
      break;
    case 'Planning application - Upload application':
      name = 'originalApplication';
      url = '/appellant-submission/upload-application';
      break;
    case 'Planning application - Upload decision letter':
      name = 'decisionLetter';
      url = '/appellant-submission/upload-decision';
      break;
    case 'Your appeal - Appeal statement':
      name = 'appealStatement';
      url = '/appellant-submission/appeal-statement';
      break;
    case 'Your appeal - Supporting documents':
      name = 'otherDocuments';
      url = '/appellant-submission/supporting-documents';
      break;
    case 'Appeal site - Site location':
      name = 'siteAddress';
      url = '/appellant-submission/site-location';
      break;
    case 'Appeal site - Site ownership':
      name = 'siteOwnership';
      url = '/appellant-submission/site-ownership';
      break;
    case 'Appeal site - Site access':
      name = 'siteAccess';
      url = '/appellant-submission/site-access';
      break;
    case 'Appeal site - Site safety':
      name = 'healthAndSafety';
      url = '/appellant-submission/site-access-safety';
      break;
    case 'Appeal submit - Check your answers':
      name = 'checkYourAnswers';
      url = '/appellant-submission/check-answers';
      break;

    default:
      throw new Error('Unknown task name = ' + name);
  }

  return { name, url };
}

Given('mandatory tasks are not completed', () => {});

Given('mandatory tasks are completed', () => {
  //goToWhoAreYouPage();
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);

  provideAnswerYes();
  clickSaveAndContinue();

  provideDetailsName('Valid Name');
  provideDetailsEmail('valid@email.com');
  clickSaveAndContinue();

  //goToPlanningApplicationNumberPage();
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);
  providePlanningApplicationNumber('ValidNumber/12345');

  //goToPlanningApplicationSubmission();
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
  uploadPlanningApplicationFile('appeal-statement-valid.doc');
  clickSaveAndContinue();

  //goToDecisionLetterPage();
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
  uploadDecisionLetterFile('appeal-statement-valid.doc');
  clickSaveAndContinue();

  //goToAppealStatementSubmission();
  goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
  checkNoSensitiveInformation();
  uploadAppealStatementFile('appeal-statement-valid.doc');
  clickSaveAndContinue();

  //goToSiteAddressPage();
  goToAppealsPage(pageURLAppeal.goToSiteAddressPage);

  provideAddressLine1('1 Taylor Road');
  provideAddressLine2('Clifton');
  provideTownOrCity('Bristol');
  provideCounty('South Glos');
  providePostcode('BS8 1TG');
  clickSaveAndContinue();

  //goToWholeSiteOwnerPage();
  goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
  answerOwnsTheWholeAppeal();
  clickSaveAndContinue();

  //goToAppealsPage('/appellant-submission/site-access');
  goToAppealsPage(pageURLAppeal.goToSiteAccessPage);
  answerCanSeeTheWholeAppeal();
  clickSaveAndContinue();

  //goToHealthAndSafetyPage();
  goToAppealsPage(pageURLAppeal.goToHealthAndSafetyPage);
  answerSiteHasNoIssues();
  clickSaveAndContinue();
});

Given('the {string} part of the appeal is not started', () => {});

Given('the {string} part of the appeal are completed', (sectionTaskName) => {
  switch (sectionTaskName) {
    case 'About you - Your details':
      //goToWhoAreYouPage();
      goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
      provideAnswerYes();
      clickSaveAndContinue();
      provideDetailsName('Valid Name');
      provideDetailsEmail('valid@email.com');
      clickSaveAndContinue();
      break;
    case 'Planning application - Application number':
      //goToPlanningApplicationNumberPage();
      goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);
      providePlanningApplicationNumber('ValidNumber/12345');
      break;
    case 'Planning application - Upload application':
      //goToPlanningApplicationSubmission();
      goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
      uploadPlanningApplicationFile('appeal-statement-valid.doc');
      clickSaveAndContinue();
      break;
    case 'Planning application - Upload decision letter':
      //goToDecisionLetterPage();
      goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
      uploadDecisionLetterFile('appeal-statement-valid.doc');
      clickSaveAndContinue();
      break;
    case 'Your appeal - Appeal statement':
      //goToAppealStatementSubmission();
      goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
      checkNoSensitiveInformation();
      uploadAppealStatementFile('appeal-statement-valid.doc');
      clickSaveAndContinue();
      break;
    case 'Your appeal - Supporting documents':
      //goToSupportingDocumentsPage();
      goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
      uploadSupportingDocuments([
        'appeal-statement-valid.tif',
        'appeal-statement-valid.jpg',
        'appeal-statement-valid.pdf',
      ]);
      clickSaveAndContinue();
      break;
    case 'Appeal site - Site location':
      //goToSiteAddressPage();
      goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
      provideAddressLine1('1 Taylor Road');
      provideAddressLine2('Clifton');
      provideTownOrCity('Bristol');
      provideCounty('South Glos');
      providePostcode('BS8 1TG');
      clickSaveAndContinue();
      break;
    case 'Appeal site - Site ownership':
      //goToWholeSiteOwnerPage();
      goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
      answerOwnsTheWholeAppeal();
      clickSaveAndContinue();
      break;
    case 'Appeal site - Site access':
      goToAppealsPage(pageURLAppeal.goToSiteAccessPage);
      answerCanSeeTheWholeAppeal();
      clickSaveAndContinue();
      break;
    case 'Appeal site - Site safety':
      goToAppealsPage(pageURLAppeal.goToHealthAndSafetyPage);
      answerSiteHasNoIssues();
      clickSaveAndContinue();
      break;
    default:
      throw new Error('Unknown task name = ' + taskName);
  }
});

Given('the {string} part of the appeal is started but not completed', (sectionTaskName) => {
  switch (sectionTaskName) {
    case 'About you - Your details':
      goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
      provideAnswerNo();
      clickSaveAndContinue();
      provideDetailsName('Valid Name');
      provideDetailsEmail('valid@email.com');
      clickSaveAndContinue();
      break;
    case 'Appeal site - Site ownership':
      //goToWholeSiteOwnerPage();
      goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
      answerDoesNotOwnTheWholeAppeal();
      clickSaveAndContinue();
      break;
    default:
      throw new Error('Unknown task name = ' + taskName);
  }
});

When('the appeal tasks are presented', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  confirmBackButtonNotDisplayed();
});

Then('the state for {string} is displayed to be {string}', (sectionTaskName, status) => {
  const task = getTask(sectionTaskName);
  checkStatusForTask(task.name, status);
});

Then('the task {string} is available for selection', (sectionTaskName) => {
  const task = getTask(sectionTaskName);
  confirmTaskIsAvailableForSelection(task.name, task.url);
});

Then('the task {string} is not available for selection', (sectionTaskName) => {
  const task = getTask(sectionTaskName);
  confirmTaskIsNotAvailableForSelection(task.name);
});
