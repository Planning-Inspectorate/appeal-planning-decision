import { Given, _, Then } from 'cypress-cucumber-preprocessor/steps';

const getAppeal = require('../../../../packages/lpa-questionnaire-web-app/src/lib/appeals-api-wrapper');
const getLPAList = require('../../../../packages/forms-web-app/src/lib/appeals-api-wrapper');

const informationSubmittedPageId = 'information-submitted';
const informationSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

const getLPAEmail = (lpaId) => {
  return getLPAList().data.filter((obj) => obj.id === lpaId).email;
};

Given(`the Information Submitted page is requested`, () => {
  cy.goToPage(informationSubmittedPageId);
});

Then(`the Information Submitted page will be shown`, () => {
  cy.verifyPageTitle(informationSubmittedPageTitle);
  cy.checkPageA11y(informationSubmittedPageId);
});

Then(`the LPA email address is displayed on the Information Submitted page`, () => {
  cy.visibleWithText(`${getLPAEmail(getAppeal().lpaCode)}`, 'lpaEmailString');
});

Then(`the LPA email address is not displayed on the Information Submitted page`, () => {
  cy.visibleWithText('', 'lpaEmailString');
});
