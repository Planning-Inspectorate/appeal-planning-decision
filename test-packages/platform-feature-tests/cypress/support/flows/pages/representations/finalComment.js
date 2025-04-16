// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class FinalComment {
    _selectors = {

    }
    addStatement(context) {
        cy.get('#statement').clear();
        cy.get('#statement').type("Statement test");
        cy.advanceToNextPage();
    }

    selectSubmitAnyFinalComment(context) {
        const basePage = new BasePage();

        if (context?.submitFinalComments?.selectAnswer) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            // Add your Final Comments
            cy.get('#FinalCommentDetails').clear();
            cy.get('#FinalCommentDetails').type("Final comment test");
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
        //    cy.uploadFileFromFixtureDirectories(context?.documents?.uploadSupportDocsFinalComments);
       //     cy.advanceToNextPage();
        }
    };
}