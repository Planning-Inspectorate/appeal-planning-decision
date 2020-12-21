module.exports = () => {
  cy.get('.govuk-button').click();
  cy.wait(Cypress.env('demoDelay'));
};
