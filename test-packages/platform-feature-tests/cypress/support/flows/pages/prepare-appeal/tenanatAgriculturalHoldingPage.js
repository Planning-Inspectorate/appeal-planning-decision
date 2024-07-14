
import { BasePage } from "../../../../page-objects/base-page";
import {TenantAgriculturalHolding } from "../../../../page-objects/prepare-appeal/tenant-agricultural-holding";
import { TellingTenants } from "../../../../page-objects/prepare-appeal/telling-tenants";
const otherTenants = require('./otherTenantsPage');
module.exports = (isTenantAgricultureHolding,context) => {
    const tenantAgriculturalHolding = new TenantAgriculturalHolding();
    const tellingTenants = new TellingTenants();
    if(isTenantAgricultureHolding){
        tenantAgriculturalHolding.clickTenantAgriculturalHolding('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
        otherTenants(context?.applicationForm?.anyOtherTenants,context);   
    } else {
        tenantAgriculturalHolding.clickTenantAgriculturalHolding('[data-cy="answer-no"]');    
        cy.advanceToNextPage();
        tellingTenants.checkTellingTenants('[data-cy="answer-yes"]');
        cy.advanceToNextPage(); 
   }
};