import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#appeal-statement-file-upload').attachFile(path);

  cy.wait(Cypress.env('demoDelay'));
};
