import { provideAddressLine1 } from '../appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../appeal-submission-appeal-site-address/provideAddressLine2';
import { provideTownOrCity } from '../appeal-submission-appeal-site-address/provideTownOrCity';
import { provideCounty } from '../appeal-submission-appeal-site-address/provideCounty';
import { providePostcode } from '../appeal-submission-appeal-site-address/providePostcode';
import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { answerOwnsTheWholeAppeal } from '../appeal-submission-appeal-site-ownership/answerOwnsTheWholeAppeal';
import { answerCanSeeTheWholeAppeal } from '../appeal-submission-access-to-appeal-site/answerCanSeeTheWholeAppeal';
import { answerSiteHasNoIssues } from '../appeal-submission-site-health-and-safety-issues/answerSiteHasNoIssues';

export const navigateForwardsWithinAppealSteps = () => {
  provideAddressLine1('1 Taylor Road');
  provideAddressLine2('Clifton');
  provideTownOrCity('Bristol');
  provideCounty('South Glos');
  providePostcode('BS8 1TG');
  clickSaveAndContinue();

  answerOwnsTheWholeAppeal();
  clickSaveAndContinue();

  answerCanSeeTheWholeAppeal();
  clickSaveAndContinue();

  answerSiteHasNoIssues();
};
