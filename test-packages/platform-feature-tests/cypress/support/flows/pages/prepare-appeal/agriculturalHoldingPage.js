
import { BasePage } from "../../../../page-objects/base-page";
const tenantAgriculturalHolding = require('./tenanatAgriculturalHoldingPage');
module.exports = (isAgriculturalHolding,context) => {    
    const basePage = new BasePage();
    if(isAgriculturalHolding) {
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
        tenantAgriculturalHolding(context?.applicationForm?.isTenantAgricultureHolding,context);
    } else {
        basePage.clickRadioBtn('[data-cy="answer-no"]');
        cy.advanceToNextPage();
    }    
};
