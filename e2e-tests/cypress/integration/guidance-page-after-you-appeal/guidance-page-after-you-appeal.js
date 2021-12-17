import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the appellant is on after you appeal page', () => {
  cy.goToPageAfterYouAppeal();
});


Then('information about start your appeal is provided', () => {
  cy.userIsNavigatedToPage('/start-your-appeal');
});

Then('information about the stages of an appeal is provided', () => {
  cy.userIsNavigatedToPage('/stages-of-an-appeal');
});

