const { verifyAppealDetailsSidebar } = require('../../../../support/common/verifyAppealDetailsSidebar');
Then('the appeal details panel is displayed on the right hand side of the page', () => {
  cy.get('@appeal').then((appeal) => {
    const address = Object.values(appeal.appealSiteSection.siteAddress).filter((value) => !!value);

    verifyAppealDetailsSidebar({
      applicationNumber: appeal.requiredDocumentsSection.applicationNumber,
      applicationAddress: address.join(', '),
      apellantName: appeal.aboutYouSection.yourDetails.name,
    });
  });
});
