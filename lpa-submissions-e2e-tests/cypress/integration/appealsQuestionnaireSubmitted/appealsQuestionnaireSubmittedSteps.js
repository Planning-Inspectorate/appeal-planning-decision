import { Given, _, Then } from 'cypress-cucumber-preprocessor/steps';

const questionnaireSubmittedPageId = 'information-submitted';
const questionnaireSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

Given(`the Questionnaire Submitted page is requested`, () => {
  cy.goToPage(questionnaireSubmittedPageId);
});

Then(`a confirmation screen is displayed`, () => {
  cy.verifyPageTitle(questionnaireSubmittedPageTitle);
  cy.checkPageA11y(questionnaireSubmittedPageId);
});
