import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the appellant is on the when you can appeal page', () => {
  cy.goToPageWhenYouCanAppeal();
});

Then('information about the stages of an appeal is provided', () => {
  cy.userIsNavigatedToPage('/stages-of-an-appeal');
});

Then('information about before you appeal is provided', () => {
  cy.userIsNavigatedToPage('/before-you-appeal');
});
