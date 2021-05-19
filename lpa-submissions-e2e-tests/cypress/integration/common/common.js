import { Given, When } from 'cypress-cucumber-preprocessor/steps';

Given('an appeal has been created', () => {
  cy.completeAppeal();
})

Given('a questionnaire has been created', () => {
  cy.generateQuestionnaire();
})

Given('all the mandatory questions for the questionnaire have been completed', () => {
  cy.completeQuestionnaire();
});

Given('the questionnaire has been completed', () => {
  cy.completeQuestionnaire();
});

When('the LPA Questionnaire is submitted', () => {
  cy.goToCheckYourAnswersPage();
  cy.clickSubmitButton();
});

When('Back is then requested', () => {
  cy.clickBackButton();
});
