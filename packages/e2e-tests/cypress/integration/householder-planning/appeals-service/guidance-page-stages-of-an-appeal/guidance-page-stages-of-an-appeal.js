import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { userIsNavigatedToPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the appellant is on the stages of an appeal page', () => {
  goToAppealsPage(pageURLAppeal.goToPageStagesOfAnAppeal);
});

Then('information about after you appeal is provided', () => {
  userIsNavigatedToPage('/after-you-appeal');
});

Then('information about when you can appeal is provided', () => {
  userIsNavigatedToPage('/when-you-can-appeal');
});
