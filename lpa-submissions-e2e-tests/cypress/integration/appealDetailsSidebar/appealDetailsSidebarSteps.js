import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
const appeal = require('../../fixtures/completedAppeal.json');

Given('A subsection page is presented with id of {string}', (id) => {
  cy.goToPage('other-appeals', id);
});

Given('A subsection page is presented with a good id', () => {
  cy.insertAppealAndCreateReply(appeal);
  cy.get('@appealReply').then( (appealReply) => {
    cy.goToPage('other-appeals', appealReply.appealId);
  });
});

Then(
  'The appeal details sidebar is displayed with the heading "Planning application number", "Site address", and "Appellant Name"',
  () => {
    cy.getAppealDetailsSidebar().then((text) => {
      expect(text).to.contain('Planning application number');
      expect(text).to.contain('Site address');
      expect(text).to.contain('Appellant Name');
    });
  },
);

Then(
  'The {string}, {string}, and {string} is displayed',
  (applicationNumber, applicationAddress, apellantName) => {
    cy.verifyAppealDetailsSidebar({
      applicationNumber,
      applicationAddress,
      apellantName,
    });
  },
);

Then('The appeal sidebar is not displayed', () => {
  cy.getAppealDetailsSidebar().should('not.exist');
});
