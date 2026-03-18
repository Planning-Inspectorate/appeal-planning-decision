// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class FinalComment {
    _selectors = {

    }
    selectSubmitAnyFinalComment(context) {
        const basePage = new BasePage();

        if (context?.submitFinalComments?.selectAnswer) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            const howSubmitType = context?.howSubmitFinalComments?.type || 'text';
            basePage.selectRadioBtn(howSubmitType);
            cy.advanceToNextPage();

            if (howSubmitType === 'text') {
                cy.get('#lpaFinalCommentDetails').clear();
                cy.get('#lpaFinalCommentDetails').type("Final comment test");
                cy.get('#sensitiveInformationCheckbox').check({ force: true });
                cy.advanceToNextPage();
            } else if (howSubmitType === 'document') {
                cy.uploadFileFromFixtureDirectories(context?.documents?.uploadSupportDocsFinalComments);
                cy.advanceToNextPage();
            }

        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}