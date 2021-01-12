module.exports = (filename) => {
  cy.goToDecisionLetterPage();
  cy.get('#decision-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  cy.validateIndividualFileUpload('#decision-upload-file-name');

  cy.wait(Cypress.env('demoDelay'));
};
