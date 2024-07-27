import { BasePage } from "../../../../page-objects/base-page";
export class AdvertisingAppealPage {
    addAdvertisingAppealData() {
        const basePage = new BasePage();
        basePage.clickCheckBox('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
    };

}
