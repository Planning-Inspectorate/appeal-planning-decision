export const getContinueButton = () => cy.get('button[data-cy=button-save-and-continue]');
export const getPageHeading = () => cy.get('h1');
export const getErrorMessageSummary =()=> cy.get('.govuk-error-summary');
export const getBackLink = () => cy.get('.govuk-back-link');
export const getErrorMessageOnLabel = () => cy.get ('#householder-planning-permission-error');
export const fileUploadButton = () => cy.get('[data-cy=button-upload-file]');
