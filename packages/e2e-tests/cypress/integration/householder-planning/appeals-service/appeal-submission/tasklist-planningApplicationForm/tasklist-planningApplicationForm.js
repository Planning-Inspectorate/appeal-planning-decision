import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { selectToUploadAppealSubmissionDocument } from '../../../../../support/householder-planning/appeals-service/appeal-submission-tasklist/selectToUploadAppealSubmissionDocument';
import { confirmUserPresentedWithUploadAppealSubmissionDocument } from '../../../../../support/householder-planning/appeals-service/appeal-submission-tasklist/confirmUserPresentedWithUploadAppealSubmissionDocument';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the user checks the status of their appeal', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
});

When('the user selects to upload their appeal submission document', () => {
  selectToUploadAppealSubmissionDocument();
});

Then('the user should be presented with opportunity to upload their appeal submission document', () => {
  confirmUserPresentedWithUploadAppealSubmissionDocument();
});
