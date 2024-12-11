// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { OtherTenantsPage } from "./otherTenantsPage";
export class TenanatAgriculturalHoldingPage {

    addTenanatAgriculturalHoldingData(isTenantAgricultureHolding, context) {
        const basePage = new BasePage();
        const otherTenantsPage = new OtherTenantsPage();

        if (isTenantAgricultureHolding) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            otherTenantsPage.addOtherTenantsData(context?.applicationForm?.anyOtherTenants);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();

            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        }
    };
}