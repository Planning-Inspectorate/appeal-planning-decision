module.exports = (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.get('#application-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });
  cy.wait(Cypress.env('demoDelay'));
};
