module.exports = (errorMessage) => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
  cy.wait(Cypress.env('demoDelay'));
};
