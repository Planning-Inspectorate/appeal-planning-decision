module.exports = () => {
  cy.url().should('include', '/submission');
  cy.wait(Cypress.env('demoDelay'));
};
