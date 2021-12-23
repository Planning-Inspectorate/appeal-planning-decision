import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { userIsNavigatedToPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { confirmGenericPageContentExists } from '../../../../support/householder-planning/appeals-service/cookie-consent-view-preferences/confirmGenericPageContentExists';
import { confirmPageHeadingWithoutJavaScriptEnabled } from '../../../../support/householder-planning/appeals-service/cookie-consent-view-preferences/confirmPageHeadingWithoutJavaScriptEnabled';
import { confirmBodyContentWithoutJavaScriptEnabled } from '../../../../support/householder-planning/appeals-service/cookie-consent-view-preferences/confirmBodyContentWithoutJavaScriptEnabled';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('a user has elected to manage their cookie preference without JavaScript enabled', () => {
  goToAppealsPage(pageURLAppeal.goToHouseholderQuestionPage({ script: false }));
  //cy.visit('/eligibility/householder-planning-permission', {script: false});
  cy.wait(2000);
});

When('the user views the Cookie Preferences service page', () => {
 // cy.visit('/cookies');
  goToAppealsPage('/cookies', { script: false });
  });

Then('the page content will mention about cookies requiring Javascript to be turned on', () => {
  userIsNavigatedToPage('cookie');
  confirmGenericPageContentExists();
  confirmPageHeadingWithoutJavaScriptEnabled();
  confirmBodyContentWithoutJavaScriptEnabled();
});

