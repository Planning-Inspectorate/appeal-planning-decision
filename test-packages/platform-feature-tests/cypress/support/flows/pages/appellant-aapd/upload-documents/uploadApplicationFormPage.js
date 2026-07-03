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
            // Some journeys show a yes/no page here, others skip it.
            cy.get('body').then(($body) => {
                if ($body.find(`[data-cy="${basePage?._selectors.answerYes}"]`).length) {
                    cy.getByData(basePage?._selectors.answerYes).click();
                    cy.advanceToNextPage();
                }
            });

            // Upload environmental statement only when that upload step is present.
            cy.url().then((url) => {
                if (url.includes('/upload-environmental-statement')) {
                    if (context?.documents?.uploadEnvironmentalStmt) {
                        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadEnvironmentalStmt);
                    }
                    cy.advanceToNextPage();
                }
            });
        }

        if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
            // Upload only when this conditional step is actually rendered.
            cy.url().then((url) => {
                if (url.includes('/upload-description-evidence')) {
                    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDevelopmentDescription);
                    cy.advanceToNextPage();
                }
            });
        }

        if (context?.statusOfOriginalApplication !== 'no decision') {
            cy.url().then((url) => {
                if (url.includes('/upload-decision-letter')) {
                    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDecisionLetter);
                    cy.advanceToNextPage();
                }
            });
        }
    };
}
