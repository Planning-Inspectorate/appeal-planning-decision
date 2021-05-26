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

When('the LPA Questionnaire is submitted', () => {
  cy.goToCheckYourAnswersPage();
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
