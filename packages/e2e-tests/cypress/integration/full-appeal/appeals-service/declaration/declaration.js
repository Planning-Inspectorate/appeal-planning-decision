import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  appealSubmittedHeading,
  confirmAndSubmitAppealButton, declarationWarningText, getBackLink,
  getSaveAndContinueButton, privacyNoticeLink, termAndConditionsLink,
} from '../../../../support/common-page-objects/common-po';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { sectionName,
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { declariationPageMethodsAgent } from '../../../../support/full-appeal/appeals-service/declariationPageMethodsAgent';
import { declarationPageMethodsAppellant } from '../../../../support/full-appeal/appeals-service/declarationPageMethodsAppellant';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';

const url = 'full-appeal/submit-appeal/declaration?';
const checkYourAnswersUrl = 'full-appeal/submit-appeal/check-answers';
const appealSubmittedUrl = 'full-appeal/submit-appeal/appeal-submitted';
const textPageCaption = 'Check your answers and submit your appeal';
const pageTitle = 'Declaration - Appeal a planning decision - GOV.UK';
const pageHeading = 'Declaration';
const submittedPageTitle = 'Appeal Submitted - Check your answers and submit your appeal - Appeal a planning decision - GOV.UK';

Given("an Appellant is on the 'Check your answers' page", () => {
    declarationPageMethodsAppellant();
});
When("they click on 'Continue' button", () => {
  getSaveAndContinueButton().click();
})
Then("they are taken to the 'Declaration' page with the Declaration text", () => {
  cy.url().should('contain', url);
  privacyNoticeLink().should('exist');
  termAndConditionsLink().should('exist');
  declarationWarningText().should('exist');
})
Given("an Appellant is ready to submit their appeal", () => {
  declarationPageMethodsAppellant();
  cy.url().should('contain', checkYourAnswersUrl);
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  sectionName(textPageCaption).should('exist');
  cy.checkPageA11y();
 })
When("they click on 'Confirm and submit appeal'", () => {
  confirmAndSubmitAppealButton().click();
})
Then("they are taken to the next page 'Appeal Submitted'", () => {
  cy.url().should('contain', appealSubmittedUrl);
  verifyPageTitle(submittedPageTitle);
  appealSubmittedHeading().should('exist');
  getBackLink().should('not.exist');
  cy.checkPageA11y();
})

Given("an Agent is on the 'Check your answers' page", () => {
  declariationPageMethodsAgent();
  cy.url().should('contain', checkYourAnswersUrl);
  cy.checkPageA11y();
})
Given("an Agent is ready to submit their appeal", () => {
  declariationPageMethodsAgent();
  cy.url().should('contain', checkYourAnswersUrl);
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
})
