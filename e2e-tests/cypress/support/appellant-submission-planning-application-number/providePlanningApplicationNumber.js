module.exports = (planningApplicationNumber) => {
  // provide the planningApplicationNumber
  cy.get('[data-cy="application-number"]')
    .type(`{selectall}{backspace}${planningApplicationNumber}`);

  cy.wait(Cypress.env('demoDelay'));

  cy.get('[data-cy="save-and-continue"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
