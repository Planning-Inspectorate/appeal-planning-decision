// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class NewPlansDrawingsPage {
    addNewPlansDrawingsData(context) {
        const basePage = new BasePage();
        if (context?.uploadDocuments?.isNewPlanOrDrawingAvailable) {
            //Do you have any new plans or drawings that support your appeal?
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload your new plans or drawings
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadNewPlanOrDrawing);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
