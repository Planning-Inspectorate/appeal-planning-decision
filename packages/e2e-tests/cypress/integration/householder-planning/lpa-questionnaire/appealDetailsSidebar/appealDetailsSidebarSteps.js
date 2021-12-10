import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('A subsection page is presented', () => {
  cy.goToPage('other-appeals');
});

Then(
  'The appeal details sidebar is displayed with the correct information',
  () => {
    cy.getAppealDetailsSidebar().then((text) => {
      expect(text).to.contain('Planning application number');
      expect(text).to.contain('Site address');
      expect(text).to.contain('Appellant Name');
    });

    cy.get('@appeal').then((appeal) => {
      const address = Object.values(appeal.appealSiteSection.siteAddress).filter((value) => !!value);

      cy.verifyAppealDetailsSidebar({
        applicationNumber: appeal.requiredDocumentsSection.applicationNumber,
        applicationAddress: address.join(', '),
        apellantName: appeal.aboutYouSection.yourDetails.name,
      });
    });
  },
);
