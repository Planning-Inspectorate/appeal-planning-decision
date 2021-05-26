import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const pageId = 'confirm-answers'

Given('a change to answer {string} is requested from Change your answers page', () => {
  cy.goToCheckYourAnswersPage();
  cy.get('@page').then(({ id }) => {
    cy.clickOnSubTaskLink(id);
  });
});

When('Check your Answers is displayed', () => {
  cy.goToCheckYourAnswersPage();
});

Then('progress is made to the Check Your Answers page', () => {
  cy.verifyPage(pageId);
});
