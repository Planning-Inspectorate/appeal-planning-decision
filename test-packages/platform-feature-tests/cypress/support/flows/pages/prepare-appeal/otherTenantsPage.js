import { OtherTenants } from "../../../../page-objects/prepare-appeal/other-tenants";
import { TellingTenants } from "../../../../page-objects/prepare-appeal/telling-tenants";
module.exports = (anyOtherTenants,context) => {
    const otherTenants = new OtherTenants();
    const tellingTenants = new TellingTenants();
    if(anyOtherTenants){
        otherTenants.clickOtherTenants('[data-cy="answer-yes"]');        
        cy.advanceToNextPage();
        tellingTenants.checkTellingTenants('[data-cy="answer-yes"]');
        cy.advanceToNextPage();  
    } else {
        otherTenants.clickOtherTenants('[data-cy="answer-no"]');        
        cy.advanceToNextPage();  
    }
};