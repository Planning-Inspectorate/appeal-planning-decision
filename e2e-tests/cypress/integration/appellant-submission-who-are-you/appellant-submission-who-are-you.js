import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user {string} previously stated {string} the original appellant', (alreadySubmitted, originalAppellant) => {
  cy.goToWhoAreYouPage();

  if (alreadySubmitted === 'had') {

    if (originalAppellant === 'being') {
      cy.answerYesOriginalAppellant();
    } else {
      cy.answerNoOriginalAppellant();
    }
    cy.clickSaveAndContinue();
    cy.goToWhoAreYouPage();
  }

});

When('the user does not state being or not the original appellant', () => {
  cy.clickSaveAndContinue();
});


When('the user states that they {string} the original appellant', (original) => {
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

Then('the user can see that their appeal has been updated with the {string} answer', (answer) => {
  cy.confirmAnswered(answer);
});

Then('the user is informed that he must answer', (answer) => {
  cy.confirmAnswered(answer);
});

Then('the user is told {string}', (message) => {
  cy.confirmWhoAreYouPageRejectedBecause(message);
});
