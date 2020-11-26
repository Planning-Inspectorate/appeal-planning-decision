import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#upload-decision').attachFile(path);
  cy.wait(Cypress.env('demoDelay'));
};
