import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { confirmUserPresentedWithProvidePlanningApplicationNumber } from '../../../../../support/householder-planning/appeals-service/appeal-submission-tasklist/confirmUserPresentedWithProvidePlanningApplicationNumber';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the user checks the status of their appeal', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
});

When('the user selects to provide their planning application number', () => {
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);
});

Then('the user should be presented with opportunity to provide their planning application number', () => {
  confirmUserPresentedWithProvidePlanningApplicationNumber();
});
