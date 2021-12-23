import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { confirmGenericPageContentExists } from '../../../../support/householder-planning/appeals-service/cookie-consent-view-preferences/confirmGenericPageContentExists';
import { confirmPageHeadingWithJavaScriptEnabled } from '../../../../support/householder-planning/appeals-service/cookie-consent-view-preferences/confirmPageHeadingWithJavaScriptEnabled';
import { confirmBodyContentWithJavaScriptEnabled } from '../../../../support/householder-planning/appeals-service/cookie-consent-view-preferences/confirmBodyContentWithJavaScriptEnabled';
import { userIsNavigatedToPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('a user has elected to manage their cookie preference', () => {
  //goToHouseholderQuestionPage();
  goToAppealsPage(pageURLAppeal.goToHouseholderQuestionPage);
});

When('the user views the Cookie Preferences service', () => {
   //goToCookiePreferences();
  goToAppealsPage(pageURLAppeal.goToCookiePreferences);
});

Then('the user is provided information of what task each cookie is performing', () => {
  userIsNavigatedToPage('cookie');
  confirmGenericPageContentExists();
  confirmPageHeadingWithJavaScriptEnabled();
  confirmBodyContentWithJavaScriptEnabled();
});
