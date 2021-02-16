import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#appeal-upload').attachFile(path);
  cy.snapshot();
};
