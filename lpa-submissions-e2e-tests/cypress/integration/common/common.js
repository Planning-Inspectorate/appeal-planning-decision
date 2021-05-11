import { Given, When } from 'cypress-cucumber-preprocessor/steps';

const appeal = require('../../fixtures/completedAppeal.json');
const reply = require('../../fixtures/completedAppealReply.json');

Given('all the mandatory questions for the questionnaire have been completed', () => {
  cy.insertAppealAndCreateReply(appeal, reply);
  cy.get('@appealReply').then( (appealReply) => {
    cy.goToCheckYourAnswersPage(appealReply.appealId);
  });
});

Given('the questionnaire has been completed', () => {
  cy.insertAppealAndCreateReply(appeal, reply);
  cy.get('@appealReply').then( (appealReply) => {
    cy.goToCheckYourAnswersPage(appealReply.appealId);
  });
});

When('the LPA Questionnaire is submitted', () => {
  cy.goToCheckYourAnswersPage();
  cy.clickSubmitButton();
});

When('Back is then requested', () => {
  cy.clickBackButton();
});
