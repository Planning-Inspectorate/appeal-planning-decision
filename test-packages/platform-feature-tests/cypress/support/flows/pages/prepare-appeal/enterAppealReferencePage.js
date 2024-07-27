import { BasePage } from "../../../../page-objects/base-page";
export class EnterAppealReferencePage {
    addAgriculturalHoldingData(isAppellantLinkedCaseAdd) {
        const basePage = new BasePage();

        if (isAppellantLinkedCaseAdd) {
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        } else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();
        }
    };
}