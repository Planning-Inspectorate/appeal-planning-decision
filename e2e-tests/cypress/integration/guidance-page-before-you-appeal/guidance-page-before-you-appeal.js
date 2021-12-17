import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the appellant is on the before you appeal page', () => {
  cy.goToPageBeforeYouAppeal();
});

Then('information about when you can appeal is provided', () => {
  cy.userIsNavigatedToPage('/when-you-can-appeal');
});
