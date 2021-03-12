module.exports = () => {
  cy.url().should('include', '/appeal-householder-decision/check-answers');
  cy.wait(Cypress.env('demoDelay'));
};
