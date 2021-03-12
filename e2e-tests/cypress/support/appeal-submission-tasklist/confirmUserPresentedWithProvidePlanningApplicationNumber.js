module.exports = () => {
  cy.url().should('contain','/appeal-householder-decision/application-number');
  cy.wait(Cypress.env('demoDelay'));
};
