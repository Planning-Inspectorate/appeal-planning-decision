import { BasePage } from "../../../../page-objects/base-page";
export class OtherTenantsPage {

    addOtherTenantsData(anyOtherTenants, context) {
        const basePage = new BasePage();

        if (anyOtherTenants) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}