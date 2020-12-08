module.exports = () => {
  cy.url().should('include', '/confirmation');
  cy.wait(Cypress.env('demoDelay'));
};
