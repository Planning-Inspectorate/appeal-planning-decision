import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#application-upload').attachFile(path);
  cy.wait(Cypress.env('demoDelay'));
};
