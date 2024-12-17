// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class OtherAppealsPage {

    _selectors = {
        appellantLinkedCase: '#appellantLinkedCase'
    }

    addOtherAppealsData(anyOtherAppeals, context) {
        const basePage = new BasePage();

        if (anyOtherAppeals) {
            for (let otherAppeal of context?.otherAppeals) {
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                basePage.addTextField(this._selectors?.appellantLinkedCase, otherAppeal?.appealReferenceNumber);
                cy.advanceToNextPage();
            }
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();

        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
