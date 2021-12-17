module.exports = () => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Select yes if your appeal is about a listed building');
    });

  cy.url().should('include', '/eligibility/listed-building');

  cy.title().should('match', /^Error: /);

  cy.wait(Cypress.env('demoDelay'));
  //Accessibility Testing
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
};
