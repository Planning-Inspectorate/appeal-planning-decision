import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When("the user answers that he's the original appellant", () => {
  cy.goToWhoAreYouPage();
  cy.answerYesOriginalAppellant();
  cy.clickSaveAndContinue();
});

When("the user answers that he's not original appellant", () => {
  cy.goToWhoAreYouPage();
  cy.answerNoOriginalAppellant();
  cy.clickSaveAndContinue();
});

When('the user will not be asked who he or she is representing', () => {
  cy.provideDetailsName('Good Name');
  cy.provideDetailsEmail('good@email.com');
  cy.clickSaveAndContinue();
  cy.confirmOriginalAppellantNotAsked();
});

Then('the user will be asked who he or she is representing', () => {
  cy.clickSaveAndContinue();
  cy.provideDetailsName('Good Name');
  cy.provideDetailsEmail('good@email.com');
  cy.clickSaveAndContinue();
  cy.confirmOriginalAppellantAsked();
});
