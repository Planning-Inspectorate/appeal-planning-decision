export const selectToUploadAppealSubmissionDocument = () => {
  cy.get('a[href*="/appellant-submission/upload-application"]').click();
};
