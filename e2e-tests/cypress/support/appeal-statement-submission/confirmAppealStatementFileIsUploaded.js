module.exports = (filename) => {
  cy.goToAppealStatementSubmission();
  cy.get('#appeal-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  cy.validateIndividualFileUpload('#appeal-upload-file-name');

  cy.wait(Cypress.env('demoDelay'));
};
