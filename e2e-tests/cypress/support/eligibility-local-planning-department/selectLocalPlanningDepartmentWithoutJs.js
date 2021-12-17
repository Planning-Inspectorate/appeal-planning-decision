module.exports = (text) => {
  cy.get('[data-cy="local-planning-department"]').select(text);
  cy.wait(Cypress.env('demoDelay'));
};
