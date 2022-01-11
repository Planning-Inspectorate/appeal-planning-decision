import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { guidancePageNavigation } from '../../../../../support/householder-planning/appeals-service/guidance-pages/guidancePageNavigation';
import { userIsNavigatedToPage } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the appellant is on the start your appeal page', () => {
  goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
});

When('the appellant has selected to start the service', () => {
  guidancePageNavigation('start');
});


Then('the appellant can begin an appeal', () => {
  userIsNavigatedToPage('/eligibility/householder-planning-permission');
});
