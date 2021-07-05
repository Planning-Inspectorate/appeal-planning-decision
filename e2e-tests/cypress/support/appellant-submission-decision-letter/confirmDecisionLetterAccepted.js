module.exports = (filename) => {
  cy.goToDecisionLetterPage();
  cy.get('[data-cy="decision-upload-file-link"]')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  cy.validateIndividualFileUpload('#decision-upload-file-name');

  cy.wait(Cypress.env('demoDelay'));
};
