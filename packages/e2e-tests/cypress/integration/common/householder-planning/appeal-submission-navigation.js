import { Then } from 'cypress-cucumber-preprocessor/steps';
import { userIsNavigatedToPage } from '../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';

Then('the user is navigated to "Appeal tasks"', () => {
  userIsNavigatedToPage('/appellant-submission/task-list');
});

Then('the user is navigated to "Applicant name"', () => {
  userIsNavigatedToPage('/appellant-submission/applicant-name');
});

Then('the user is navigated to "Supporting documents"', () => {
  userIsNavigatedToPage('/appellant-submission/supporting-documents');
});

Then('the user is navigated to "Site access"', () => {
  userIsNavigatedToPage('/appellant-submission/site-access');
});

Then('the user is navigated to "Site ownership"', () => {
  userIsNavigatedToPage('/appellant-submission/site-ownership');
});

Then('the user is navigated to "Site ownership certb"', () => {
  userIsNavigatedToPage('/appellant-submission/site-ownership-certb');
});

Then('the user is navigated to "Site safety"', () => {
  userIsNavigatedToPage('/appellant-submission/site-access-safety');
});

Then('the user is navigated to "Upload application"', () => {
  userIsNavigatedToPage('/appellant-submission/upload-application');
});

Then('the user is navigated to "Upload decision letter"', () => {
  userIsNavigatedToPage('/appellant-submission/upload-decision');
});

Then('the user is navigated to "Your details"', () => {
  userIsNavigatedToPage('/appellant-submission/your-details');
});
