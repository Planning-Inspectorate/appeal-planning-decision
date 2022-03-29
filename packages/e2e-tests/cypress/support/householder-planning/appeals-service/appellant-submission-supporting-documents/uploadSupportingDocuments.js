import 'cypress-file-upload';

export const uploadSupportingDocuments = (filename) => {
  cy.get('#supporting-documents').attachFile([filename]);
};
