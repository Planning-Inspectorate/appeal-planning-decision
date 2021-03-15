module.exports = (applicationNumber) => {
  cy.visit('/appeal-householder-decision/application-number');
  cy.get('[data-cy="application-number"]').should('have.value', applicationNumber);
  cy.wait(Cypress.env('demoDelay'));
};
