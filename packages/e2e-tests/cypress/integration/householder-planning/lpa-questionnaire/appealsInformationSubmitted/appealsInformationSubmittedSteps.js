import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

const informationSubmittedUrl = 'information-submitted';
const informationSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

Given(`the Information Submitted page is requested`, () => {
  cy.goToPage(informationSubmittedUrl);
});

Then(`the Information Submitted page will be shown`, () => {
  cy.verifyPage(informationSubmittedUrl);
  cy.verifyPageTitle(informationSubmittedPageTitle);
});

Then(`the LPA email address is displayed on the Information Submitted page`, () => {
  cy.visibleWithText(
    `We’ve sent a confirmation email to AppealPlanningDecisionTest@planninginspectorate.gov.uk.`,
    '[data-cy=lpaEmailString]',
  );
});
