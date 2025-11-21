// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class LandownerPermissionPage {

    selectLandownerPermission(isLandownerPermission, context) {
        const basePage = new BasePage();

        if (isLandownerPermission) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}