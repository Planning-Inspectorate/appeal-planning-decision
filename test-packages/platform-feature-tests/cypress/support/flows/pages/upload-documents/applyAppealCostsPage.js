// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class ApplyAppealCostsPage {
    addApplyAppealCostsData(context) {
        const basePage = new BasePage();
        if (context?.uploadDocuments?.isApplyAwardCost) {
            //Do you need to apply for an award of appeal costs?
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();

            //Upload your application for an award of appeal costs            
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadApplicationForAppealCost);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
