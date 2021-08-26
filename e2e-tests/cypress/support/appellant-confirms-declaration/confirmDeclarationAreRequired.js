module.exports = () => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Select to confirm you agree');
    });

  cy.title().should('match', /^Error: /);
  cy.wait(Cypress.env('demoDelay'));
};
