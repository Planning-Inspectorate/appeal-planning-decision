module.exports = (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.get('#application-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  cy.validateIndividualFileUpload('#application-upload-file-name');

  cy.wait(Cypress.env('demoDelay'));
};
