module.exports = () => {
  cy.get('[data-cy="button-upload-file"]').first().click();
  cy.wait(Cypress.env('demoDelay'));
};
