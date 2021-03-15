module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/confirmation');
  cy.wait(Cypress.env('demoDelay'));
};
