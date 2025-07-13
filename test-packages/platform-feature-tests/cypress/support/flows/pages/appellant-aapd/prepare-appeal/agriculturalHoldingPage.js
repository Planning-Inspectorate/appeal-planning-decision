// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
import { TenanatAgriculturalHoldingPage } from "./tenanatAgriculturalHoldingPage";
//const tenantAgriculturalHolding = require('./tenanatAgriculturalHoldingPage');

export class AgriculturalHoldingPage {
    addAgriculturalHoldingData(isAgriculturalHolding, context) {
        const basePage = new BasePage();
        const tenanatAgriculturalHoldingPage = new TenanatAgriculturalHoldingPage();
        if (isAgriculturalHolding) {
            cy.getByData(basePage?._selectors.answerYes).click();        
            cy.advanceToNextPage();
            tenanatAgriculturalHoldingPage.addTenanatAgriculturalHoldingData(context?.applicationForm?.isTenantAgricultureHolding, context);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
};
