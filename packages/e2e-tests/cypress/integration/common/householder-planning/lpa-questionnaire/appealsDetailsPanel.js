import { Then } from 'cypress-cucumber-preprocessor/steps';
import { getAppealDetailsSidebar } from '../../../../support/common-page-objects/common-po';
import { verifyAppealDetailsSidebar } from '../../../../support/common/verifyAppealDetailsSidebar';

Then(
  'the appeal details sidebar is displayed with the correct information',
  () => {
    getAppealDetailsSidebar().then((text) => {
      expect(text).to.contain('Planning application number');
      expect(text).to.contain('Site address');
      expect(text).to.contain('Appellant Name');
    });

    cy.get('@appeal').then((appeal) => {
      const address = Object.values(appeal.appealSiteSection.siteAddress).filter((value) => !!value);

      verifyAppealDetailsSidebar({
        applicationNumber: appeal.requiredDocumentsSection.applicationNumber,
        applicationAddress: address.join(', '),
        apellantName: appeal.aboutYouSection.yourDetails.name,
      });
    });
  },
);
