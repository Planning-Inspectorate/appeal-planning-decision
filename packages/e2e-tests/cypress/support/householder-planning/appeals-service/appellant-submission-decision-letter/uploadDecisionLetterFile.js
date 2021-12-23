import 'cypress-file-upload';

export const uploadDecisionLetterFile = (path) => {
  cy.get('#decision-upload').attachFile({ filePath: path, encoding: 'binary' });
};
