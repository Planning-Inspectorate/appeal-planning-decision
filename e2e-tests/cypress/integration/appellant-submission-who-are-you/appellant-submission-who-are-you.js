import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('the user has stated that they {string} the original appellant', (original) => {
  cy.goToWhoAreYouPage();
  if (original === 'are') {
    cy.answerYesOriginalAppellant();
  } else {
    cy.answerNoOriginalAppellant();
  }
  cy.clickSaveAndContinue();
});

Then('the user will {string} asked who they are representing', (asked) => {
  cy.provideDetailsName('Good Name');
  cy.provideDetailsEmail('good@email.com');
  cy.clickSaveAndContinue();

  if (asked === 'be') {
    cy.confirmOriginalAppellantAsked();
  } else {
    cy.confirmOriginalAppellantNotAsked();
  }
});
