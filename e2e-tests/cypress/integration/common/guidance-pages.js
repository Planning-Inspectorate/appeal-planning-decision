import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('the appellant navigates to the next page', () => {
  cy.guidancePageNavigation('next');
});

When('the appellant navigates to the previous page', () => {
  cy.guidancePageNavigation('previous');
});

When('the appellant select a link from the content list: {string}', (link) => {
  cy.guidancePageSelectContentList(link);
});

Then('the appellant is navigated to that page: {string}', (url) => {
  cy.userIsNavigatedToPage(url);
});
