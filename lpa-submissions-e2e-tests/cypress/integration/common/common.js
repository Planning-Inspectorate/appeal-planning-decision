import { Given, When } from 'cypress-cucumber-preprocessor/steps';

Given('all the mandatory questions for the questionnaire have been completed', () => {
  cy.completeQuestionnaire();
});

When('Back is then requested', () => {
  cy.clickBackButton();
});
