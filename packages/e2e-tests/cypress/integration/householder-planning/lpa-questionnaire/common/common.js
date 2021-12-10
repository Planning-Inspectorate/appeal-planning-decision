import { Given, When } from 'cypress-cucumber-preprocessor/steps';
import authenticateLPA from '../../../../support/householder-planning/lpa-questionnaire/magic-link/authenticateLPA';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import completeQuestionnaire from '../../../../support/common/completeQuestionnaire';
import { completeAppeal } from '../../../../support/common/completeAppeal';
import generateQuestionnaire from '../../../../support/common/generateQuestionnaire';

Given("an appeal has been created", () => {
  completeAppeal();
});

Given('a questionnaire has been created', () => {
  generateQuestionnaire();
});

Given('the LPA Planning Officer is authenticated', () => {
  authenticateLPA();
});

Given('all the mandatory questions for the questionnaire have been completed', () => {
  completeQuestionnaire();
});

Given('the questionnaire has been completed', () => {
  completeQuestionnaire();
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
    verifyPage(url);
    verifyPageTitle(title);
    verifyPageHeading(heading);
    verifySectionName(section);
    cy.checkPageA11y();
  });
});
