import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { userIsNavigatedToPage } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the appellant is on the when you can appeal page', () => {
  goToAppealsPage(pageURLAppeal.goToPageWhenYouCanAppeal);
});

Then('information about the stages of an appeal is provided', () => {
  userIsNavigatedToPage('/stages-of-an-appeal');
});

Then('information about before you appeal is provided', () => {
  userIsNavigatedToPage('/before-you-appeal');
});
