import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../../../../common/householder-planning/appeals-service/standard-appeal';
import '../../cookies/cookies';
import { provideCompleteAppeal } from '../../../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmNavigationTermsAndConditionsPage } from '../../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/appellant-submission/confirmNavigationTermsAndConditionsPage';
import { agreeToTheDeclaration } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmAppealSubmitted';
import { navigateToSubmissionInformationPage } from '../../../../../support/householder-planning/appeals-service/appeal-submission-information/navigateToSubmissionInformationPage';
import { confirmSubmissionInformationDisplayItems } from '../../../../../support/householder-planning/appeals-service/appeal-submission-information/confirmSubmissionInformationDisplayItems';

Given('a prospective appellant has provided valid appeal information', () => {
  provideCompleteAppeal(STANDARD_APPEAL);
  clickCheckYourAnswers();

  // /appellant-submission/check-answers
  clickSaveAndContinue();
});

When('the appeal is submitted', () => {
  confirmNavigationTermsAndConditionsPage();

  // /appellant-submission/submission
  agreeToTheDeclaration();
});

Then('a submission information file is created', () => {
  // /appellant-submission/confirmation
  confirmAppealSubmitted();

  navigateToSubmissionInformationPage();

  confirmSubmissionInformationDisplayItems({
    'who-are-you': 'Yes',
    'appellant-name': 'Valid Name',
    'appellant-email': 'valid@email.com',
    'application-number': 'ValidNumber/12345',
    'upload-application': 'appeal-statement-valid.doc',
    'upload-decision': 'appeal-statement-valid.doc',
    'appeal-statement': 'appeal-statement-valid.doc',
    'supporting-documents-no-files': 'No files uploaded',
    'site-location': '1 Taylor Road\nClifton\nBristol\nSouth Glos\nBS8 1TG',
    'site-ownership': 'Yes',
    'site-access': 'Yes',
    'site-access-safety': 'No',
  });
});
