import { Given, _, Then } from 'cypress-cucumber-preprocessor/steps';

const informationSubmittedPageId = 'information-submitted';
const informationSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

Given(`the Information Submitted page is requested`, () => {
  cy.goToPage(informationSubmittedPageId);
});

Then(`the Information Submitted page will be shown`, () => {
  cy.verifyPageTitle(informationSubmittedPageTitle);
  cy.checkPageA11y(informationSubmittedPageId);
});
