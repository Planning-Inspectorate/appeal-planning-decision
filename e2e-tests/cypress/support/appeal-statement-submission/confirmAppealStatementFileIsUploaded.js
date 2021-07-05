module.exports = (filename) => {
  cy.goToAppealStatementSubmission();
  cy.get('[data-cy="appeal-upload-file-link"]')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  cy.validateIndividualFileUpload('#appeal-upload-file-name');

  cy.wait(Cypress.env('demoDelay'));
};
