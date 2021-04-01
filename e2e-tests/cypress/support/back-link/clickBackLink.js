module.exports = () => {
  cy.get('[data-cy="back"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
