module.exports = (filename) => {
  cy.goToAppealStatementSubmission();
  cy.get('#upload-decision-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });
  cy.wait(Cypress.env('demoDelay'));
};
