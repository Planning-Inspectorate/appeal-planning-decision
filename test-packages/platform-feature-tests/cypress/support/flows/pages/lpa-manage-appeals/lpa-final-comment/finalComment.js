// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class FinalComment {
    _selectors = {

    }
    addStatement(context) {
        cy.get('#lpaStatement').clear();
        cy.get('#lpaStatement').type("Statement test");
        cy.advanceToNextPage();
    }

    selectSubmitAnyFinalComment(context) {
        const basePage = new BasePage();

        if (context?.submitFinalComments?.selectAnswer) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            // Add your Final Comments
            cy.get('#lpaFinalCommentDetails').clear();
            cy.get('#lpaFinalCommentDetails').type("Final comment test");
            cy.get('#sensitiveInformationCheckbox').check({ force: true });
            cy.advanceToNextPage();
            //Upload your witnesses and their evidence
            if (context?.additionalDocument?.selectAnswer) {
                cy.getByData(basePage?._selectors?.answerYes).click();
                cy.advanceToNextPage();
                cy.uploadFileFromFixtureDirectories(context?.documents?.uploadAdditionalDocsSupportFinalComments);
                cy.advanceToNextPage();
            } else {
                cy.getByData(basePage?._selectors?.answerNo).click();
                cy.advanceToNextPage();
            }

        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
            //Upload your witnesses and their evidence
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadSupportDocsFinalComments);
            cy.advanceToNextPage();
        }
    };
}