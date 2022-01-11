import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { answerDoesNotOwnTheWholeAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerDoesNotOwnTheWholeAppeal';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { userIsNavigatedToPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { provideAddressLine1 } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideAddressLine2';
import { provideTownOrCity } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideTownOrCity';
import { provideCounty } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideCounty';
import { providePostcode } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/providePostcode';
import { answerOwnsTheWholeAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerOwnsTheWholeAppeal';
import { answerHaveToldOtherOwnersAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerHaveToldOtherOwnersAppeal';
import { answerHaveNotToldOtherOwnersAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerHaveNotToldOtherOwnersAppeal';
import { answerCanSeeTheWholeAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/answerCanSeeTheWholeAppeal';
import { answerCannotSeeTheWholeAppeal } from '../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/answerCannotSeeTheWholeAppeal';
import { provideMoreDetails } from '../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/provideMoreDetails';
import { answerSiteHasNoIssues } from '../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/answerSiteHasNoIssues';
import { answerSiteHasIssues } from '../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/answerSiteHasIssues';
import { provideSafetyIssuesConcerns } from '../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/provideSafetyIssuesConcerns';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the "Site location" is presented', () => {
  //goToSiteAddressPage();
  goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
});

Given('the "Site ownership" is presented', () => {
  //goToWholeSiteOwnerPage();
  goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
});

Given('the "Site ownership certb" is presented', () => {
  //goToOtherSiteOwnerToldPage();
  goToAppealsPage(pageURLAppeal.goToOtherSiteOwnerToldPage);
});

Given('the "Site ownership" is not wholly owned', () => {
  //goToWholeSiteOwnerPage();
  goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
  answerDoesNotOwnTheWholeAppeal();
  clickSaveAndContinue();
  userIsNavigatedToPage('/appellant-submission/site-ownership-certb');
});

Given('the "Site access" is presented', () => {
  //goToAppealsPage('/appellant-submission/site-access');
  goToAppealsPage(pageURLAppeal.goToSiteAccessPage);
});

Given('the "Site safety" is presented', () => {
  //goToHealthAndSafetyPage();
  goToAppealsPage(pageURLAppeal.goToHealthAndSafetyPage);
});

When('the "Site location" is submitted with valid values', () => {
  provideAddressLine1('1 Taylor Road');
  provideAddressLine2('Clifton');
  provideTownOrCity('Bristol');
  provideCounty('South Glos');
  providePostcode('BS8 1TG');
  clickSaveAndContinue();
});

When('the "Site ownership" is submitted with a YES value', () => {
  answerOwnsTheWholeAppeal();
  clickSaveAndContinue();
});

When('the "Site ownership" is submitted with a NO value', () => {
  answerDoesNotOwnTheWholeAppeal();
  clickSaveAndContinue();
});

When('the "Site ownership certb" is submitted with a YES value', () => {
  answerHaveToldOtherOwnersAppeal();
  clickSaveAndContinue();
});

When('the "Site ownership certb" is submitted with a NO value', () => {
  answerHaveNotToldOtherOwnersAppeal();
  clickSaveAndContinue();
});

When('the "Site access" is submitted with a YES value', () => {
  answerCanSeeTheWholeAppeal();
  clickSaveAndContinue();
});

When(
  'the "Site access" is submitted with a NO value and text about how access is restricted',
  () => {
    answerCannotSeeTheWholeAppeal();
    provideMoreDetails('More information');
    clickSaveAndContinue();
  },
);

When(
  'the "Site safety" is submitted with a YES value and text about health and safety concerns',
  () => {
    answerSiteHasNoIssues();
    clickSaveAndContinue();
  },
);

When('the "Site safety" is submitted with a NO value', () => {
  answerSiteHasIssues();
  provideSafetyIssuesConcerns('There are some concerns...');
  clickSaveAndContinue();
});
