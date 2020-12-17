module.exports = (planningApplicationNumber) => {
  cy.visit('/appellant-submission/application-number');
  cy.get('[data-cy="application-number"]')
    .type(`{selectall}{backspace}${planningApplicationNumber}`);
  cy.wait(Cypress.env('demoDelay'));
  cy.get('[data-cy="save-and-continue"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
