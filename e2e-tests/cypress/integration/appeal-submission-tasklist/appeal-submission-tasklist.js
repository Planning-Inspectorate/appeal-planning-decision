import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

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
  cy.goToWhoAreYouPage();
  cy.answerYesOriginalAppellant();
  cy.clickSaveAndContinue();

  cy.provideDetailsName('Valid Name');
  cy.provideDetailsEmail('valid@email.com');
  cy.clickSaveAndContinue();

  cy.goToPlanningApplicationNumberPage();
  cy.providePlanningApplicationNumber('ValidNumber/12345');
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToAppealStatementSubmission();
  cy.checkNoSensitiveInformation();
  cy.uploadAppealStatementFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToSiteAddressPage();
  cy.provideAddressLine1('1 Taylor Road');
  cy.provideAddressLine2('Clifton');
  cy.provideTownOrCity('Bristol');
  cy.provideCounty('South Glos');
  cy.providePostcode('BS8 1TG');
  cy.clickSaveAndContinue();

  cy.goToWholeSiteOwnerPage();
  cy.answerOwnsTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.goToAccessSitePage();
  cy.answerCanSeeTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.goToHealthAndSafetyPage();
  cy.answerSiteHasNoIssues();
  cy.clickSaveAndContinue();
});

Given('the {string} part of the appeal is not started', () => {});

Given('the {string} part of the appeal are completed', (sectionTaskName) => {
  switch (sectionTaskName) {
    case 'About you - Your details':
      cy.goToWhoAreYouPage();
      cy.answerYesOriginalAppellant();
      cy.clickSaveAndContinue();
      cy.provideDetailsName('Valid Name');
      cy.provideDetailsEmail('valid@email.com');
      cy.clickSaveAndContinue();
      break;
    case 'Planning application - Application number':
      cy.goToPlanningApplicationNumberPage();
      cy.providePlanningApplicationNumber('ValidNumber/12345');
      break;
    case 'Planning application - Upload application':
      cy.goToPlanningApplicationSubmission();
      cy.uploadPlanningApplicationFile('appeal-statement-valid.doc');
      cy.clickSaveAndContinue();
      break;
    case 'Planning application - Upload decision letter':
      cy.goToDecisionLetterPage();
      cy.uploadDecisionLetterFile('appeal-statement-valid.doc');
      cy.clickSaveAndContinue();
      break;
    case 'Your appeal - Appeal statement':
      cy.goToAppealStatementSubmission();
      cy.checkNoSensitiveInformation();
      cy.uploadAppealStatementFile('appeal-statement-valid.doc');
      cy.clickSaveAndContinue();
      break;
    case 'Your appeal - Supporting documents':
      cy.goToSupportingDocumentsPage();
      cy.uploadSupportingDocuments([
        'appeal-statement-valid.tif',
        'appeal-statement-valid.jpg',
        'appeal-statement-valid.pdf',
      ]);
      cy.clickSaveAndContinue();
      break;
    case 'Appeal site - Site location':
      cy.goToSiteAddressPage();
      cy.provideAddressLine1('1 Taylor Road');
      cy.provideAddressLine2('Clifton');
      cy.provideTownOrCity('Bristol');
      cy.provideCounty('South Glos');
      cy.providePostcode('BS8 1TG');
      cy.clickSaveAndContinue();
      break;
    case 'Appeal site - Site ownership':
      cy.goToWholeSiteOwnerPage();
      cy.answerOwnsTheWholeAppeal();
      cy.clickSaveAndContinue();
      break;
    case 'Appeal site - Site access':
      cy.goToAccessSitePage();
      cy.answerCanSeeTheWholeAppeal();
      cy.clickSaveAndContinue();
      break;
    case 'Appeal site - Site safety':
      cy.goToHealthAndSafetyPage();
      cy.answerSiteHasNoIssues();
      cy.clickSaveAndContinue();
      break;
    default:
      throw new Error('Unknown task name = ' + taskName);
  }
});

Given('the {string} part of the appeal is started but not completed', (sectionTaskName) => {
  switch (sectionTaskName) {
    case 'About you - Your details':
      cy.goToWhoAreYouPage();
      cy.answerNoOriginalAppellant();
      cy.clickSaveAndContinue();
      cy.provideDetailsName('Valid Name');
      cy.provideDetailsEmail('valid@email.com');
      cy.clickSaveAndContinue();
      break;
    case 'Appeal site - Site ownership':
      cy.goToWholeSiteOwnerPage();
      cy.answerDoesNotOwnTheWholeAppeal();
      cy.clickSaveAndContinue();
      break;
    default:
      throw new Error('Unknown task name = ' + taskName);
  }
});

When('the appeal tasks are presented', () => {
  cy.goToTaskListPage();
  cy.confirmBackButtonNotDisplayed();
});

Then('the state for {string} is displayed to be {string}', (sectionTaskName, status) => {
  const task = getTask(sectionTaskName);
  cy.checkStatusForTask(task.name, status);
});

Then('the task {string} is available for selection', (sectionTaskName) => {
  const task = getTask(sectionTaskName);
  cy.confirmTaskIsAvailableForSelection(task.name, task.url);
});

Then('the task {string} is not available for selection', (sectionTaskName) => {
  const task = getTask(sectionTaskName);
  cy.confirmTaskIsNotAvailableForSelection(task.name);
});
