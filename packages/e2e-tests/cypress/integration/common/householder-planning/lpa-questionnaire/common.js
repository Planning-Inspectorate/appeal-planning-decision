import { Given, When } from 'cypress-cucumber-preprocessor/steps';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import { completeAppeal } from '../../../../support/householder-planning/lpa-questionnaire/completeAppeal';
import { generateQuestionnaire } from '../../../../support/householder-planning/lpa-questionnaire/generateQuestionnaire';
import { completeQuestionnaire } from '../../../../support/householder-planning/lpa-questionnaire/completeQuestionnaire';
import { clickSubmitButton } from '../../../../support/common/clickSubmitButton';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';
import {goToCheckYourAnswersPage} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/goToCheckYourAnswersPage';


Given("an appeal has been created", () => {
  completeAppeal();
});

Given('a questionnaire has been created', () => {
  generateQuestionnaire();
});

Given('all the mandatory questions for the questionnaire have been completed', () => {
  completeQuestionnaire();
});

Given('the questionnaire has been completed', () => {
  completeQuestionnaire();
});

Given('{string} question has been requested', () => {

  cy.get('@page').then(({ url }) => {
    goToLPAPage(url);
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
    goToLPAPage(url);
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


