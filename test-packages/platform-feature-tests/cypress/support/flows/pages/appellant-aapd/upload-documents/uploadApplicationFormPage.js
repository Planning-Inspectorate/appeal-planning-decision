// @ts-nocheck
/// <reference types="cypress"/>
export class UploadApplicationFormPage {
    addUploadApplicationFormData(context) {
        //Upload your application form
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlanningApplConfirmLetter);
        cy.advanceToNextPage();
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
