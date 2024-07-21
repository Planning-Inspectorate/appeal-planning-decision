import { BasePage } from "../../../../page-objects/base-page";
module.exports = (context) => {
    const basePage = new BasePage();

    basePage.addTextField('#address-line-1','siteAddress_addressLine1');
    basePage.addTextField('#address-line-2','siteAddress_addressLine2');
    basePage.addTextField('#address-town','Test Town');
    basePage.addTextField('#address-county','Test County1');
    basePage.addTextField('#address-postcode','SW7 9PB'); 
    cy.advanceToNextPage();
    
};