// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class UploadApplicationFormPage {
    addUploadApplicationFormData(context) {
        const basePage = new BasePage();
        //Upload your application form
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlanningApplConfirmLetter);
        cy.advanceToNextPage();
        if (context?.expeditedAppeal) {
            // Did you submit an environmental statement with the application?
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            // Upload your environmental statement
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadEnvironmentalStmt);
            cy.advanceToNextPage();
        }

        if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
            //Upload evidence of your agreement to change the description of development
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDevelopmentDescription);
            cy.advanceToNextPage();
        }

        if (context?.statusOfOriginalApplication !== 'no decision') {
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDecisionLetter);
            cy.advanceToNextPage();
        }
    };
}
