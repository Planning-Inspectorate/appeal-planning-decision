import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

const informationSubmittedUrl = 'information-submitted';
const informationSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

const getLPAEmail = (lpaId) => {
  return getLPAList().data.filter((obj) => obj.id === lpaId).email;
};

Given(`the Information Submitted page is requested`, () => {
  cy.goToPage(informationSubmittedUrl);
});

Then(`the Information Submitted page will be shown`, () => {
  cy.verifyPage(informationSubmittedUrl);
  cy.verifyPageTitle(informationSubmittedPageTitle);
  cy.checkPageA11y();
});

Then(`the LPA email address is displayed on the Information Submitted page`, () => {
  cy.visibleWithText(
    `We’ve sent a confirmation email to abby.bale@planninginspectorate.gov.uk.`,
    '[data-cy=lpaEmailString]',
  );
});

Then(`the LPA email address is displayed on the Information Submitted page`, () => {
  cy.visibleWithText(`${getLPAEmail(getAppeal().lpaCode)}`, 'lpaEmailString');
});

Then(`the LPA email address is not displayed on the Information Submitted page`, () => {
  cy.visibleWithText('', 'lpaEmailString');
});
