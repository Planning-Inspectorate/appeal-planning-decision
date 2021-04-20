Then('the appeal details panel is displayed on the right hand side of the page', () => {
  cy.get('@appeal').then( (appeal) => {
    const {siteAddress} = appeal.appealSiteSection;
    cy.verifyAppealDetailsSidebar({
      applicationNumber: appeal.requiredDocumentsSection.applicationNumber,
      applicationAddress: `${siteAddress.addressLine1}, ${siteAddress.addressLine2}, ${siteAddress.town}, ${siteAddress.county}, ${siteAddress.postcode}`,
      apellantName: appeal.aboutYouSection.yourDetails.name,
    });
  });
});
