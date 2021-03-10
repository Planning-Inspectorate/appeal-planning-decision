import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the appellant is on the stages of an appeal page', () => {
  cy.goToPageStagesOfAnAppeal();
});

Then('information about after you appeal is provided', () => {
  cy.userIsNavigatedToPage('/after-you-appeal');
});

Then('information about when you can appeal is provided', () => {
  cy.userIsNavigatedToPage('/when-you-can-appeal');
});
