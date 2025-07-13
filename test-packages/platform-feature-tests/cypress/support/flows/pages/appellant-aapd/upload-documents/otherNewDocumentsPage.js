// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class OtherNewDocumentsPage {

    addOtherNewDocumentsData(context) {
        const basePage = new BasePage();
        if (context?.uploadDocuments?.isOtherNewDocumentAvailable) {
            //Do you have any other new documents that support your appeal?#
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload your other new supporting documents
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadOtherNewSupportDoc);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
