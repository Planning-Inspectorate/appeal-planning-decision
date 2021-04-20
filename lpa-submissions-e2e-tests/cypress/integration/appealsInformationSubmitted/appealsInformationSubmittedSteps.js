import { Given, _, Then } from 'cypress-cucumber-preprocessor/steps';

const informationSubmittedPageId = 'information-submitted';
const informationSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

const {appeal} = require('../../fixtures/anAppeal.json');

Given(`the Information Submitted page is requested`, () => {
  cy.insertAppealAndCreateReply(appeal);
  cy.get('@appealReply').then( (appealReply) => {
    cy.goToPage(informationSubmittedPageId, appealReply.appealId);
  });
});

Then(`the Information Submitted page will be shown`, () => {
  cy.verifyPageTitle(informationSubmittedPageTitle);
  cy.get('@appealReply').then( (appealReply) => {
    cy.checkPageA11y(`/${appealReply.appealId}/${informationSubmittedPageId}`);
  });
});
