import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { guidancePageNavigation } from '../../../../support/householder-planning/appeals-service/guidance-pages/guidancePageNavigation';
import { guidancePageSelectContentList } from '../../../../support/householder-planning/appeals-service/guidance-pages/guidancePageSelectContentList';
import { userIsNavigatedToPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';

When('the appellant navigates to the next page', () => {
  guidancePageNavigation('next');
});

When('the appellant navigates to the previous page', () => {
 guidancePageNavigation('previous');
});

When('the appellant select a link from the content list: {string}', (link) => {
  guidancePageSelectContentList(link);
});

Then('the appellant is navigated to that page: {string}', (url) => {
  userIsNavigatedToPage(url);
});
