import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { userIsNavigatedToPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the appellant is on after you appeal page', () => {
  //goToPageAfterYouAppeal();
  goToAppealsPage(pageURLAppeal.goToPageAfterYouAppeal);
});


Then('information about start your appeal is provided', () => {
  userIsNavigatedToPage('/start-your-appeal');
});

Then('information about the stages of an appeal is provided', () => {
  userIsNavigatedToPage('/stages-of-an-appeal');
});

