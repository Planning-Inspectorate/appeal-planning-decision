import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { guidancePageNavigation } from '../../../../support/householder-planning/appeals-service/guidance-pages/guidancePageNavigation';
import { userIsNavigatedToPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { viewCookiePageUsingCookieConsentBannerLink } from '../../../../support/householder-planning/appeals-service/cookies/viewCookiePageUsingCookieConsentBannerLink';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';

Given('a user visits the site with JavaScript disabled', () => {
  goToAppealsPage('', { script: false });
});

When('the user navigates through the service', () => {
  guidancePageNavigation('next');
  userIsNavigatedToPage('/when-you-can-appeal');
});

When('the user views the cookie preferences page', () => {
  viewCookiePageUsingCookieConsentBannerLink();
});

Then('the cookies page is presented', () => {
  userIsNavigatedToPage('/cookies');
});
