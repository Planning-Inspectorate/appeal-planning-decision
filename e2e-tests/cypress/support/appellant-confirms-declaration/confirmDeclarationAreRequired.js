module.exports = () => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('You need to agree to the declaration');
    });

  cy.title().should('match', /^Error: /);
  cy.wait(Cypress.env('demoDelay'));
};
