// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class SeparateOwnershipCertificatePage {

    addSeparateOwnershipCertificateData(context) {
        const basePage = new BasePage();
        if (context?.uploadDocuments?.haveSeparateOwnershipAndLandDecl) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            // //Upload your separate ownership certificate and agricultural land declaration
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadSeparateOwnershipCertAndAgricultureDoc);
            cy.advanceToNextPage();

        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }

        //Upload your appeal statement
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
        cy.advanceToNextPage();
    };
}