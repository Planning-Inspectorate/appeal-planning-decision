import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { uploadPlanningApplicationFile } from '../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/uploadPlanningApplicationFile';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmPlanningApplicationRejectedBecause } from '../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/confirmPlanningApplicationRejectedBecause';
import { confirmPlanningApplicationAccepted } from '../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/confirmPlanningApplicationAccepted';
import { confirmPlanningApplicationIsNotUploaded } from '../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/confirmPlanningApplicationIsNotUploaded';
import { confirmPlanningApplicationFileIsUploaded } from '../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/confirmPlanningApplicationFileIsUploaded';
import { confirmThatNoErrorTriggered } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmThatNoErrorTriggered';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';


Given('user did not previously submitted a planning application file',() => {})

Given('user has previously submitted a planning application file {string}', (filename) => {
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
  uploadPlanningApplicationFile(filename);
  clickSaveAndContinue();
});

Given(
  'user has previously submitted a valid planning application file {string} followed by an invalid file {string} that was rejected because {string}',
  (validFile, invalidFile, reason) => {
    goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
    uploadPlanningApplicationFile(validFile);
    clickSaveAndContinue();
    goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
    uploadPlanningApplicationFile(invalidFile);
    clickSaveAndContinue();

    switch (reason) {
      case 'file type is invalid':
        confirmPlanningApplicationRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        confirmPlanningApplicationRejectedBecause('The selected file must be smaller than');
        break;
    }
  },
);

When('user submits a planning application file {string}', (filename) => {
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
  uploadPlanningApplicationFile(filename);
  clickSaveAndContinue();
});

When('user does not submit a planning application file', () => {
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
  clickSaveAndContinue();
});

Then('application file {string} is submitted and user can proceed', (filename) => {
  confirmPlanningApplicationAccepted(filename);
});

Then('user can see that no planning application file is submitted', (reason) => {
  confirmPlanningApplicationIsNotUploaded();
});

Then(
  'user can see that the planning application file {string} {string} submitted',
  (filename, submitted) => {
    goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);

    if (submitted === 'is') {
      confirmPlanningApplicationFileIsUploaded(filename);
      confirmThatNoErrorTriggered();
    } else {
      confirmPlanningApplicationIsNotUploaded();
    }
  },
);


Then('user is informed that he needs to upload a planning application file', () => {
  confirmPlanningApplicationRejectedBecause('Select a planning application form');
})

Then(
  'user is informed that the planning application file is not submitted because {string}',
  (reason) => {
    switch (reason) {
      case 'file type is invalid':
        confirmPlanningApplicationRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        confirmPlanningApplicationRejectedBecause('The selected file must be smaller than');
        break;
    }
  },
);
