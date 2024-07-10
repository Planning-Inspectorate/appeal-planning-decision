import { OtherTenants } from "../../../../page-objects/prepare-appeal/other-tenants";
module.exports = () => {
    const otherTenants = new OtherTenants();
    otherTenants.clickOtherTenants('#otherTenantsAgriculturalHolding');        
    cy.advanceToNextPage();        
    
};