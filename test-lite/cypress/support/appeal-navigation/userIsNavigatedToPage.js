module.exports = (page) => {
  cy.url().should('include', page);
  cy.wait(Cypress.env('demoDelay'));
};
