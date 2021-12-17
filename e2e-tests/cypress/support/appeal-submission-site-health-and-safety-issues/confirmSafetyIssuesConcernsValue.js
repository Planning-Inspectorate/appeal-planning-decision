module.exports = (concernsMessage) => {
  cy.get('#site-access-safety-concerns').should('have.value', concernsMessage);

  cy.wait(Cypress.env('demoDelay'));
};
