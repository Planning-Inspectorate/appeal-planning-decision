import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { provideEnforcementNoticeAnswer } from '../../../../support/householder-planning/appeals-service/eligibility-enforcement-notice/provideEnforcementNoticeAnswer';
import { confirmThatEnforcementNoticeAnswerIsRequired } from '../../../../support/householder-planning/appeals-service/eligibility-enforcement-notice/confirmThatEnforcementNoticeAnswerIsRequired';
import { confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals } from '../../../../support/householder-planning/appeals-service/eligibility-enforcement-notice/confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals';
import { confirmProgressIsMadeToListingBuildingEligibilityQuestion } from '../../../../support/householder-planning/appeals-service/eligibility-enforcement-notice/confirmProgressIsMadeToListingBuildingEligibilityQuestion';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('receipt of an Enforcement Notice is requested', () => {
  goToAppealsPage(pageURLAppeal.goToEnforcementNoticePage);
});

When('receipt of an Enforcement Notice is not provided', () => {
  provideEnforcementNoticeAnswer(undefined);
});

When('the appellant has received an Enforcement Notice', () => {
  provideEnforcementNoticeAnswer(true);
});

When('the appellant has not received an Enforcement Notice', () => {
  provideEnforcementNoticeAnswer(false);
});

Then('progress is halted with a message that the Enforcement Notice question is required', () => {
  confirmThatEnforcementNoticeAnswerIsRequired();
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
});

Then(
  'progress is halted with a message that this service is only for householder planning appeals',
  () => {
    confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals();
  },
);

Then('progress is made to the Listed Building eligibility question', () => {
  confirmProgressIsMadeToListingBuildingEligibilityQuestion();
});
