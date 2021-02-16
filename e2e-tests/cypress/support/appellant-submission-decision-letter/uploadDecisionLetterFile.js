import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#decision-upload').attachFile(path);
  cy.snapshot();
};
