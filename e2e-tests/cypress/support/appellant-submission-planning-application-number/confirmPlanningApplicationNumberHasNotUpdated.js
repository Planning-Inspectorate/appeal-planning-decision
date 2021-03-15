module.exports = () => {
  cy.visit('/appeal-householder-decision/application-number');
  cy.get('[data-cy="application-number"].value').should('not.exist');
  cy.wait(Cypress.env('demoDelay'));
};
