module.exports = (errorMessage) => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });

  cy.url().should('include', '/appellant-submission/who-are-you');

  cy.title().should('match', /^Error: /);

  cy.wait(Cypress.env('demoDelay'));
};
