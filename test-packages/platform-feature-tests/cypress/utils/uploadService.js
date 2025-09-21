/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
export const upload25MBFileValidation = (context) => {
    //cy.get('a[href*="upload-documents"]').first().click();
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFileGreaterThan25mb);
    cy.advanceToNextPage();
    cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', `${context?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
}

export const uploadFilesWithWrongFormats = (context) => {
    //cy.get('a[href*="upload-documents"]').first().click();
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
    cy.advanceToNextPage();
    cy.shouldHaveErrorMessage('a[href*="#uploadLpaStatementDocuments"]', `${context?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
}

// export const uploadDuplicateFiles = (context) => {
//     const expectedFileNames = [context?.documents?.uploadEmergingPlan, context?.documents?.uploadEmergingPlan];
//     expectedFileNames.forEach((fileName) => {
//         cy.uploadFileFromFixtureDirectory(fileName);
//     })
//     cy.get('.govuk-summary-list .moj-multi-file-upload__list li').should('have.length', 1);
//     cy.advanceToNextPage();
// }

export const uploadDuplicateFiles = (context) => {
  const files = [
    context?.documents?.uploadEmergingPlan,
    context?.documents?.uploadEmergingPlan,   // duplicate on purpose?
  ].filter(Boolean);

  // Upload each file
  files.forEach((fileName, idx) => {
    cy.uploadFileFromFixtureDirectory(fileName);

    // After each upload, wait for the new <li> to appear and contain the filename
   
    cy.contains('.moj-multi-file-upload__list-item, .moj-multi-file-upload__message',
      fileName,
      { timeout: 10000 }
    ).should('be.visible');
  });

  // Final sanity check: total items match files uploaded (or whatever you expect)
  cy.get('ul.govuk-summary-list.moj-multi-file-upload__list > li', { timeout: 10000 })
    .should('have.length', 1);

  cy.advanceToNextPage();
};
