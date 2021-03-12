module.exports = () => {
  cy.url().should('contain','/appeal-householder-decision/upload-application');
  cy.wait(Cypress.env('demoDelay'));
};
