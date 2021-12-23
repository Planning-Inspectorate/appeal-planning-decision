import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { uploadDecisionLetterFile } from '../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/uploadDecisionLetterFile';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmDecisionLetterRejectedBecause } from '../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/confirmDecisionLetterRejectedBecause';
import { confirmDecisionLetterAccepted } from '../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/confirmDecisionLetterAccepted';
import { confirmDecisionLetterIsNotUploaded } from '../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/confirmDecisionLetterIsNotUploaded';
import { confirmDecisionLetterFileIsUploaded } from '../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/confirmDecisionLetterFileIsUploaded';
import { confirmThatNoErrorTriggered } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/confirmThatNoErrorTriggered';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';


Given('user did not previously submitted a decision letter file',() => {})

Given('user has previously submitted a decision letter file {string}', (filename) => {
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
  uploadDecisionLetterFile(filename);
  clickSaveAndContinue();
});

Given(
  'user has previously submitted a valid decision letter file {string} followed by an invalid file {string} that was rejected because {string}',
  (validFile, invalidFile, reason) => {
    goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
    uploadDecisionLetterFile(validFile);
    clickSaveAndContinue();
    goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
    uploadDecisionLetterFile(invalidFile);
    clickSaveAndContinue();

    switch (reason) {
      case 'file type is invalid':
        confirmDecisionLetterRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        confirmDecisionLetterRejectedBecause('The selected file must be smaller than');
        break;
    }
  },
);

When('user submits a decision letter file {string}', (filename) => {
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
  uploadDecisionLetterFile(filename);
  clickSaveAndContinue();
});

When('user does not submit a decision letter file', () => {
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
  clickSaveAndContinue();
});

Then('decision letter file {string} is submitted and user can proceed', (filename) => {
  confirmDecisionLetterAccepted(filename);
});

Then('user can see that no decision letter file is submitted', (reason) => {
  confirmDecisionLetterIsNotUploaded();
});

Then(
  'user can see that the decision letter file {string} {string} submitted',
  (filename, submitted) => {
    goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);

    if (submitted === 'is') {
      confirmDecisionLetterFileIsUploaded(filename);
      confirmThatNoErrorTriggered();
    } else {
      confirmDecisionLetterIsNotUploaded();
    }
  },
);


Then('user is informed that he needs to upload a decision letter file',() => {
  confirmDecisionLetterRejectedBecause('Select a decision letter');
})

Then(
  'user is informed that the decision letter file is not submitted because {string}',
  (reason) => {
    switch (reason) {
      case 'file type is invalid':
        confirmDecisionLetterRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        confirmDecisionLetterRejectedBecause('The selected file must be smaller than');
        break;
    }
  },
);
