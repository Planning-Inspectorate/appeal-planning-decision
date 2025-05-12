// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class Statement {
    _selectors = {

    }
    addStatement(context) {
        cy.get('#lpaStatement').clear();
        cy.get('#lpaStatement').type("Statement test");
        cy.advanceToNextPage();

    }

    haveAdditionalDocumentforStatement(context) {
        const basePage = new BasePage();
        if (context?.additionalDocument?.selectAnswer) {
            cy.getByData(basePage?._selectors?.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadStatement);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors?.answerNo).click();
            cy.advanceToNextPage();
        }
    }
}