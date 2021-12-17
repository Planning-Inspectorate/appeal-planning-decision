module.exports = (filenames) => {
  cy.goToSupportingDocumentsPage();

  cy.get('.moj-multi-file-upload__list')
    .invoke('text')
    .then((text) => {
      if (!Array.isArray(filenames)) {
        filenames = [filenames];
      }
      filenames.forEach((filename) => expect(text).to.contain(filename));
    });

  cy.wait(Cypress.env('demoDelay'));
};
