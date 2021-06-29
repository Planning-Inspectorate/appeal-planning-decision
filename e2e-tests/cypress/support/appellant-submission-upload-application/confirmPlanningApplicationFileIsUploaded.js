module.exports = (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.get('[data-cy="application-upload-file-link"]')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });
  cy.wait(Cypress.env('demoDelay'));
};
