import { Given, When } from 'cypress-cucumber-preprocessor/steps';

Given('all the mandatory questions for the questionnaire have been completed', () => {
  cy.completeQuestionnaire();
});

Given('the questionnaire has been completed', () => {
  cy.completeQuestionnaire();
});

Given('{string} question has been requested', () => {
  cy.get('@page').then(({ url }) => {
    cy.goToPage(url);
  });
});

Given('the questionnaire for appeal {string} has been completed', (appealId) => {
  cy.completeQuestionnaire(appealId);
});

When('the LPA Questionnaire is submitted', () => {
  cy.goToCheckYourAnswersPage();
  cy.clickSubmitButton();
});

When('the LPA Questionnaire for appeal {string} is submitted', (appealId) => {
  cy.goToCheckYourAnswersPage(appealId);
  cy.clickSubmitButton();
});

When('Back is then requested', () => {
  cy.clickBackButton();
});

When('the inspector returns to the question', () => {
  cy.get('@page').then(({ url }) => {
    cy.goToPage(url);
  });
});

Then('LPA Planning Officer is presented with ability to add this information', () => {
  cy.get('@page').then(({ url, title, heading, section }) => {
    cy.verifyPage(url);
    cy.verifyPageTitle(title);
    cy.verifyPageHeading(heading);
    cy.verifySectionName(section);
    cy.checkPageA11y();
  });
});
