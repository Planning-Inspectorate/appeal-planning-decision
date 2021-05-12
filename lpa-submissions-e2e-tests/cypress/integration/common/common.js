import { Given, When } from 'cypress-cucumber-preprocessor/steps';

const appeal = require('../../fixtures/completedAppeal.json');
const reply = require('../../fixtures/completedAppealReply.json');

Given('all the mandatory questions for the questionnaire have been completed', () => {
  cy.insertAppealAndCreateReply(appeal, reply);
  cy.goToCheckYourAnswersPage();
});

Given('the questionnaire has been completed', () => {
  cy.insertAppealAndCreateReply(appeal, reply);
  cy.goToCheckYourAnswersPage();
});

When('the LPA Questionnaire is submitted', () => {
  cy.goToCheckYourAnswersPage();
  cy.clickSubmitButton();
});

When('Back is then requested', () => {
  cy.clickBackButton();
});
