import 'cypress-file-upload';

export const uploadAppealStatementFile = (path) => {
  cy.get('#appeal-upload').attachFile({ filePath: path, encoding: 'binary' });
  cy.wait(Cypress.env('demoDelay'));
};
