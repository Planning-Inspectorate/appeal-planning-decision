import { AppealSiteAddress } from "../../../../page-objects/prepare-appeal/appeal-site-address";
module.exports = (context) => {
    const appealSiteAddress = new AppealSiteAddress();

    appealSiteAddress.addAppealSiteAddressField('#address-line-1','siteAddress_addressLine1');
    appealSiteAddress.addAppealSiteAddressField('#address-line-2','siteAddress_addressLine2');
    appealSiteAddress.addAppealSiteAddressField('#address-town','Test Town');
    appealSiteAddress.addAppealSiteAddressField('#address-county','Test County1');
    appealSiteAddress.addAppealSiteAddressField('#address-postcode','SW7 9PB'); 
    cy.advanceToNextPage();
    
};