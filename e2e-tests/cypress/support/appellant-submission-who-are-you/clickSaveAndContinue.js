module.exports = () => {
  // try to save and continue
  cy.get('.govuk-button').click();
  cy.wait(Cypress.env('demoDelay'));
};
