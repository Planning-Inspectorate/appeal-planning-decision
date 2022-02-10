import {getAppealDetailsSidebar} from "../../../../support/common-page-objects/common-po";
import {verifyAppealDetailsSidebar} from "../../../../support/common/verifyAppealDetailsSidebar";

Then(
  'the appeal details are displayed on the right side panel',
  () => {
    getAppealDetailsSidebar().then((text) => {
      expect(text).to.contain('Planning application number');
      expect(text).to.contain('Site address');
      expect(text).to.contain('Appellant Name');
    });

    cy.get('@fullappeal').then((appeal) => {
      const address = Object.values(appeal.appealSiteSection.siteAddress).filter((value) => !!value);

      verifyAppealDetailsSidebar({
        applicationNumber: appeal.requiredDocumentsSection.applicationNumber,
        applicationAddress: address.join(', '),
        apellantName: appeal.aboutYouSection.yourDetails.name,
      });
    });
  },
);
