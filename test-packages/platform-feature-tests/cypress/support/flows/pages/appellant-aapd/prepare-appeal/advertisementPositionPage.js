// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class AdvertisementPositionPage {

    selectAdvertisementPosition(isAdvertisementPosition, context) {
        const basePage = new BasePage();

        if (isAdvertisementPosition) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}