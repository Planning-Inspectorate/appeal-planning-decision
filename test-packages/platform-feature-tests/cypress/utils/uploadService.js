/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
export const upload25MBFileValidation = (context) => {
    //cy.get('a[href*="upload-documents"]').first().click();
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFileGreaterThan25mb);
    cy.advanceToNextPage();
    cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', `${context?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
}