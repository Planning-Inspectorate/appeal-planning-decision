import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';

import { provideCompleteAppeal } from '../../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { agreeToTheDeclaration } from '../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/agreeToTheDeclaration';
import { navigateToSubmissionInformationPage } from '../../../../support/householder-planning/appeals-service/appeal-submission-information/navigateToSubmissionInformationPage';
import { confirmAppealSubmitted } from '../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmAppealSubmitted';
import { confirmSubmissionInformationDisplayItems } from '../../../../support/householder-planning/appeals-service/appeal-submission-information/confirmSubmissionInformationDisplayItems';
import { APPEAL_NOT_OWNER_OTHERS_INFORMED } from '../../../common/householder-planning/appeals-service/standard-appeal';

Given('an agent or appellant has submitted an appeal and they do not wholly own the site', () => {
  provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_INFORMED);
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();
  navigateToSubmissionInformationPage();
});

When('the pdf is viewed', () => {
  // Get the PDF when we have it available ... for now just test the html source
});

Then('the answer for other owner notification is displayed as submitted', () => {
  confirmSubmissionInformationDisplayItems({
    'site-ownership': 'No',
    'other-owner-notification': 'Yes, I have already told the other owners',
  });
});
