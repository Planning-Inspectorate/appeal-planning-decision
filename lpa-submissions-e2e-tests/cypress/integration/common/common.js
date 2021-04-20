import { Given } from 'cypress-cucumber-preprocessor/steps';

const {appeal} = require('../../fixtures/anAppeal.json');
const reply = require('../../fixtures/completedAppealReply.json');

Given('all the mandatory questions for the questionnaire have been completed', () => {
  cy.insertAppealAndCreateReply(appeal, reply);

  cy.get('@appealReply').then( (appealReply) => {
    cy.goToCheckYourAnswersPage(appealReply.appealId);
  });
});
