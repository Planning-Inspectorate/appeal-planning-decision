export const errorFileUploadField = () => cy.get('#file-upload-error');
export const filesCanUploadHintText = () => cy.get('.govuk-details__summary-text');
export const uploadedFileLabel = () => cy.findAllByText('Uploaded file');
export const uploadedFileName = () => cy.get('.govuk-link');
export const replaceTheFileLabel = () => cy.findAllByText('Replace the file');
export const sectionText = () => cy.get('.govuk-body');
