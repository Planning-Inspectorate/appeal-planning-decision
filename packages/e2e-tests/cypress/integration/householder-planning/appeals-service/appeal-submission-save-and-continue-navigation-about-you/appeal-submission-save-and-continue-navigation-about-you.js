import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { provideAreYouOriginalApplicant } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideAreYouOriginalApplicant';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { provideDetailsName } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsName';
import { provideDetailsEmail } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsEmail';
import { provideNameOfOriginalApplicant } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideNameOfOriginalApplicant';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the "Who are you" is presented', () => {
  //goToWhoAreYouPage();
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
});

Given('the "Your details" is presented for an original applicant', () => {
 // goToYourDetailsPage();
  goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
  provideAreYouOriginalApplicant('are');
  clickSaveAndContinue();
});

Given('the "Your details" is presented for not the original applicant', () => {
  goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
  provideAreYouOriginalApplicant('are not');
  clickSaveAndContinue();
});

Given('the "Applicant name" is presented', () => {
  provideAreYouOriginalApplicant('are');
  //gotooApplicantNamePage();
  goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
});

When('the "Who are you" is submitted with valid values', () => {
  provideAreYouOriginalApplicant('are');
  clickSaveAndContinue();
});

When('the "Your details" is submitted with valid values', () => {
  provideDetailsName('Timmy Tester');
  provideDetailsEmail('timmy@example.com');
  clickSaveAndContinue();
});

When('the "Applicant name" is submitted with valid values', () => {
  provideNameOfOriginalApplicant('Timmy Tester');
  clickSaveAndContinue();
});
