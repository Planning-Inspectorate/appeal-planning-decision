import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { checkNoSensitiveInformation } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/checkNoSensitiveInformation';
import { uploadAppealStatementFile } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/uploadAppealStatementFile';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { uncheckNoSensitiveInformation } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/uncheckNoSensitiveInformation';
import { confirmAppealStatementFileIsNotUploaded } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmAppealStatementFileIsNotUploaded';
import { confirmAppealStatementFileIsUploaded } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmAppealStatementFileIsUploaded';
import { confirmThatNoErrorTriggered } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmThatNoErrorTriggered';
import { confirmFileContainsSensitiveInformation } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmFileContainsSensitiveInformation';
import { confirmFileInvalidBecauseWrongFileType } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmFileInvalidBecauseWrongFileType';
import { confirmFileInvalidBecauseExceedsSizeLimit } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmFileInvalidBecauseExceedsSizeLimit';
import { confirmFileUploadIsRequested } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmFileUploadIsRequested';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';


Given('user did not previously submitted an appeal statement file', () => {});


Given('user has previously submitted an appeal statement file {string}', (filename) => {
  //goToAppealStatementSubmission();
  goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
  checkNoSensitiveInformation();
  uploadAppealStatementFile(filename);
  clickSaveAndContinue();
});

When(
  'user confirms that there is no sensitive information without selecting an appeal statement file to upload',
  () => {
    goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
    checkNoSensitiveInformation();
    clickSaveAndContinue();
  },
);


When('user does not confirm that there is no sensitive information nor upload a statement',() => {
  goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
  clickSaveAndContinue();
})

When(
  'user submits an appeal statement file {string} confirming that it {string} contain sensitive information',
  (filename, has_sensitive_info) => {
    goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
    if (has_sensitive_info === 'does not') {
      checkNoSensitiveInformation();
    } else {
      uncheckNoSensitiveInformation();
    }
    uploadAppealStatementFile(filename);
    clickSaveAndContinue();
  },
);

Then('user can see that no appeal statement file is submitted', () => {
  confirmAppealStatementFileIsNotUploaded();
});

Then(
  'user can see that the appeal statement file {string} {string} submitted',
  (filename, submitted) => {
    if (submitted === 'is') {
      confirmAppealStatementFileIsUploaded(filename);
      confirmThatNoErrorTriggered();
    } else {
      confirmAppealStatementFileIsNotUploaded();
    }
  },
);

Then('user is informed that the file is not submitted because {string}', (reason) => {
  cy.title().should('match', /^Error: /);
  switch (reason) {
    case 'file contains sensitive information':
      confirmFileContainsSensitiveInformation();
      break;
    case 'file type is invalid':
      confirmFileInvalidBecauseWrongFileType();
      break;
    case 'file size exceeds limit':
      confirmFileInvalidBecauseExceedsSizeLimit();
      break;
  }
});


Then('user is informed that he needs to select an appeal statement',() => {
  confirmFileUploadIsRequested();
  cy.title().should('match', /^Error: /);
});


Then('user is informed that he needs to select an appeal statement and confirms that it does not contain sensitive information',() =>{
  confirmFileUploadIsRequested();
  confirmFileContainsSensitiveInformation();
  cy.title().should('match', /^Error: /);
})


Given(
  'user has previously submitted a valid appeal statement file {string} followed by an invalid file {string} that was rejected because {string}',
  (validFile, invalidFile, reason) => {
    goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
    checkNoSensitiveInformation();
    uploadAppealStatementFile(validFile);
    clickSaveAndContinue();
    goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
    checkNoSensitiveInformation();
    uploadAppealStatementFile(invalidFile);
    clickSaveAndContinue();
    switch (reason) {
      case 'file type is invalid':
        confirmFileInvalidBecauseWrongFileType();
        break;
      case 'file size exceeds limit':
        confirmFileInvalidBecauseExceedsSizeLimit();
        break;
    }
  },
);
