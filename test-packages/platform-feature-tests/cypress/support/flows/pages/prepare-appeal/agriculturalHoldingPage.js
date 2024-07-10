
import { BasePage } from "../../../../page-objects/base-page";
import {AgriculturalHolding } from "../../../../page-objects/prepare-appeal/agricultural-holding";
module.exports = (isagriculturalHolding) => {
    const agriculturalHolding = new AgriculturalHolding();
    if(isagriculturalHolding) {
        agriculturalHolding.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
    } else {
        agriculturalHolding.clickRadioBtn('[data-cy="answer-no"]');
        cy.advanceToNextPage();
    }

    
};
