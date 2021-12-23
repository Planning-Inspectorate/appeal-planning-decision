import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../householder-planning/standard-appeal';
import { provideCompleteAppeal } from '../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickSaveAndContinue } from '../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmNavigationTermsAndConditionsPage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/appellant-submission/confirmNavigationTermsAndConditionsPage';
import { agreeToTheDeclaration } from '../../../support/householder-planning/appeals-service/appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmFeedbackLinkIsDisplayedInPageBody } from '../../../support/householder-planning/appeals-service/appeal-submission/confirmFeedbackLinkIsDisplayedInPageBody';
import { goToAppealsPage } from '../../../support/householder-planning/appeals-service/go-to-page/goToAppealsPage';
import { pageURLAppeal } from './pageURLAppeal';

Given('an appeal exists', () => {
  provideCompleteAppeal(STANDARD_APPEAL);
  goToAppealsPage(pageURLAppeal.goToSubmissionPage);
});

When('the user confirms their answers', () => {
  clickSaveAndContinue();
});

Then('the user should be presented with the Terms and Conditions of the service', () => {
  confirmNavigationTermsAndConditionsPage();
});

When('the appeal confirmation is presented', () => {
  agreeToTheDeclaration();
});

Then('the required link is displayed in the page body', () => {
  confirmFeedbackLinkIsDisplayedInPageBody();
});
