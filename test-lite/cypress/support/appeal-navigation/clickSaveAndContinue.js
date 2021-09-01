module.exports = () => {
  cy.get('[data-cy="button-save-and-continue"]').first().click();
  cy.wait(Cypress.env('demoDelay'));
};
