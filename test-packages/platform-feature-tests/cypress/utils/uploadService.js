/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
export const upload50MBFileValidation = (context) => {
    //cy.get('a[href*="upload-documents"]').first().click();
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFileGreaterThan50mb);
    cy.advanceToNextPage();
    cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', `${context?.documents?.uploadFileGreaterThan50mb} must be smaller than 50MB`);
}

export const uploadFilesWithWrongFormats = (context) => {
    //cy.get('a[href*="upload-documents"]').first().click();
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
    cy.advanceToNextPage();
    cy.shouldHaveErrorMessage('a[href*="#uploadLpaStatementDocuments"]', `${context?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG, PNG or XLSX`);
}

export const uploadDuplicateFiles = (context) => {
     const expectedFileNames = [context?.documents?.uploadEmergingPlan, context?.documents?.uploadEmergingPlan];
     expectedFileNames.forEach((fileName) => {
        cy.uploadFileFromFixtureDirectory(fileName);
    })
     cy.get('.govuk-summary-list moj-multi-file-upload__list').should('have.length', 1);
    cy.advanceToNextPage();
}

