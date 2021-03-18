import 'cypress-file-upload';

module.exports = (paths) => {
  const documentUpload = cy.get('#upload-documents');

  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  paths.forEach((path) => documentUpload.attachFile(path));

  cy.wait(Cypress.env('demoDelay'));
};
