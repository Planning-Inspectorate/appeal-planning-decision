import { Given, When,Then} from 'cypress-cucumber-preprocessor/steps';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import { completeAppeal } from '../../../../support/common/completeAppeal';
import { generateQuestionnaire } from '../../../../support/common/generateQuestionnaire';
import { authenticateLPA } from '../../../../support/householder-planning/lpa-questionnaire/magic-link/authenticateLPA';
import { completeQuestionnaire } from '../../../../support/common/completeQuestionnaire';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import {
  goToCheckYourAnswersPage
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/goToCheckYourAnswersPage';
import { clickSubmitButton } from '../../../../support/common/clickSubmitButton';
import { getBackLink } from '../../../../support/common-page-objects/common-po';

Given('an appeal has been created', () => {
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
    goToPage(url);
  });
});

When('the LPA Questionnaire is submitted', () => {
  goToCheckYourAnswersPage();
  clickSubmitButton();
});

When('Back is then requested', () => {
  getBackLink().click();
});

When('the inspector returns to the question', () => {
  cy.get('@page').then(({ url }) => {
    goToPage(url);
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
