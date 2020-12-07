import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#appeal-statement').attachFile(path);
  cy.wait(Cypress.env('demoDelay'));
};
