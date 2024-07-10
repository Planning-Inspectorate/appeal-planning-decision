
import { BasePage } from "../../../../page-objects/base-page";
import {TenantAgriculturalHolding } from "../../../../page-objects/prepare-appeal/tenant-agricultural-holding";
module.exports = () => {
    const tenantAgriculturalHolding = new TenantAgriculturalHolding();
     
    tenantAgriculturalHolding.clickRadioBtn('[data-cy="answer-yes"]');
    
    cy.advanceToNextPage();    
    
};