import { Given, _, Then } from 'cypress-cucumber-preprocessor/steps';

const questionnaireSubmittedPageId = 'questionnaire-submitted';
const questionnaireSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

Given(`the Questionnaire Submitted page is requested`, () => {
  cy.goToPage(questionnaireSubmittedPageId);
});

Then(`the Questionnaire Submitted page will be shown`, () => {
  cy.verifyPageTitle(questionnaireSubmittedPageTitle);
  cy.checkPageA11y(questionnaireSubmittedPageId);
});
