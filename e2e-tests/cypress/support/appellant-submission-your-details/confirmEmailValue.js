module.exports = (email) => {
  cy.goToDetailsPage();
  cy.wait(Cypress.env('demoDelay'));
  cy.get('#appellant-email').should('have.value', email);
  cy.wait(Cypress.env('demoDelay'));
};
