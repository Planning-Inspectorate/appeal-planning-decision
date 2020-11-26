import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#upload-application').attachFile(path);
  cy.wait(Cypress.env('demoDelay'));
};
