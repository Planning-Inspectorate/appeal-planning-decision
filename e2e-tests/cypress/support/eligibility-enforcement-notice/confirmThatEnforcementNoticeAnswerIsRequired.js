module.exports = () => {
  cy.url().should('include', '/eligibility/enforcement-notice');

  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Select Yes if you’ve received an enforcement notice');
    });

  cy.title().should('match', /^Error: /);

  cy.wait(Cypress.env('demoDelay'));
};
