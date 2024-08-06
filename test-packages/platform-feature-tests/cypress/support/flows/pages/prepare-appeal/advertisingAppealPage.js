import { BasePage } from "../../../../page-objects/base-page";
export class AdvertisingAppealPage {
    addAdvertisingAppealData() {
        const basePage = new BasePage();
        cy.getByData(basePage?._selectors.answerYes).click();
        cy.advanceToNextPage();
    };

}
