import 'cypress-file-upload';

export const uploadSupportingDocuments = (paths) => {
  const documentUpload = cy.get('#supporting-documents');

  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  paths.forEach((path) => documentUpload.attachFile({ filePath: path, encoding: 'binary' }));

  cy.wait(Cypress.env('demoDelay'));
};
