
import { BasePage } from "../../../../page-objects/base-page";
import { TenanatAgriculturalHoldingPage } from "./tenanatAgriculturalHoldingPage";
//const tenantAgriculturalHolding = require('./tenanatAgriculturalHoldingPage');

export class AgriculturalHoldingPage {
    addAgriculturalHoldingData(isAgriculturalHolding, context) {
        const basePage = new BasePage();
        const tenanatAgriculturalHoldingPage = new TenanatAgriculturalHoldingPage();
        if (isAgriculturalHolding) {
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
            tenanatAgriculturalHoldingPage.addTenanatAgriculturalHoldingData(context?.applicationForm?.isTenantAgricultureHolding, context);
        } else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();
        }
    };
};
