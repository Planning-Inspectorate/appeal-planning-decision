
//import { TenantAgriculturalHolding } from "test-packages/platform-feature-tests/cypress/page-objects/prepare-appeal/tenant-agricultural-holding";
import { BasePage } from "../../../../page-objects/base-page";
import { AgriculturalHolding } from "../../../../page-objects/prepare-appeal/agricultural-holding";
const tenantAgriculturalHolding = require('./tenanatAgriculturalHoldingPage');
module.exports = (isAgriculturalHolding,context) => {
    const agriculturalHolding = new AgriculturalHolding();
    if(isAgriculturalHolding) {
        agriculturalHolding.clickAgriculturalHolding('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
        tenantAgriculturalHolding(context?.applicationForm?.isTenantAgricultureHolding,context);
    } else {
        agriculturalHolding.clickAgriculturalHolding('[data-cy="answer-no"]');
        cy.advanceToNextPage();
    }    
};
