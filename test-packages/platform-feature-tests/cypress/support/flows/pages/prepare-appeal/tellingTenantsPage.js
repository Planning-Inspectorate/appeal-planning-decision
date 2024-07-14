import { TellingTenants } from "../../../../page-objects/prepare-appeal/telling-tenants";
module.exports = () => {
    const tellingTenants = new TellingTenants();

    tellingTenants.checkTellingTenants('#informedTenantsAgriculturalHolding');  
          
    cy.advanceToNextPage();        
    
};