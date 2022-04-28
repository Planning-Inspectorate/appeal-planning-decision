export const sensitiveInfoLabel = () =>
  cy.findAllByText('See a full list of what counts as sensitive information');
export const filesYouCanUpload = () => cy.findAllByText('Files you can upload');
export const checkboxConfirmSensitiveInfo = () => cy.get('#does-not-include-sensitive-information');
export const sensitiveInfoText = () => cy.get('.govuk-details__text');
export const appealStatementBodyText = () => cy.get('.govuk-body');
export const checkboxErrorMessage = () => cy.get('#does-not-include-sensitive-information-error');
