import { BasePage } from "../../../../page-objects/base-page";
export class EnterAppealReferencePage {
    addAgriculturalHoldingData(isAppellantLinkedCaseAdd) {
        const basePage = new BasePage();

        if (isAppellantLinkedCaseAdd) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}