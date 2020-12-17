module.exports = (name) => {
  cy.goToDetailsPage();
  cy.wait(Cypress.env('demoDelay'));
  cy.get('#appellant-name').should('have.value', name);
  cy.wait(Cypress.env('demoDelay'));
};
