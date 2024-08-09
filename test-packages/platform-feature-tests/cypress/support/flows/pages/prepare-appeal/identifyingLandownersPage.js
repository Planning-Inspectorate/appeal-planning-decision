import { BasePage } from "../../../../page-objects/base-page";
export class IdentifyingLandownersPage {

    addIdentifyingLandownersData() {
        const basePage = new BasePage();

        cy.getByData(basePage?._selectors.answerYes).click();
        cy.advanceToNextPage();
    };
}