import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('all the mandatory questions for the questionnaire have been completed', () => {
  cy.completeQuestionnaire();
});
